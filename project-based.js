/**
 * ########################################################
 * #### PROJECT-BASED TEMPLATE USING PLUGIN APPROACH ######
 * ########################################################
 * 
 */

/**
 * VARIABLE DECLARATIONS.
 * - the indesign template to use
 * - initialise the spread count (needed for multiple projects)
 * - the project data you'll be using
 * - how many images you need
 */
var indesign = new InDesign(data.templates.v1);
var spread = 0;
var projects = data.projects;
var imagesNeeded = 2;

/**
 * DEFINE FIELD AND KEYWORD ARRAYS
 * - these can be used to define which fields and keywords you want applied to the template
 * - fields and keywords need to be returned to the data object via the script json
 * - the 'code' value of the field/keyword is used here, rather than the display name as its easier to search for
 * - can loop through these arrays and append the text of the field/keyword to the template using {@link appendProjectDetails}
 */
var fieldCodes = [
    'Size',
    'CompletionDate',
    'Description'
];

var keywordCodes = [
    'City',
    'Country',
    'Client'
];


/**
 * Append text to the template at the page and location
 * @param {string} text - the text to append
 * @param {string} pageItem - label of text box in template
 * @param {string} spread - the spread index that the text box is on
 * @param {string} characterStyle - character style to use
 */
function appendProjectDetails(text, pageItem, spreadIndex, characterStyle) {
    var pageItemPlaceHolder = where().pageItems(pageItem);
    indesign.overridePageItems(spreadIndex, pageItemPlaceHolder);
    indesign.appendText(text, pageItemPlaceHolder.spreads(spreadIndex), characterStyle);
}


/**
 * OUTER LOOP - PROJECT LOOP
 * - will loop through all projects that the template is to be generated for
 * - spread will increment at end of loop in order to add a new page
 */
for (var i = 0; i < projects.length; i++) {

    //APPLY IMAGES

    //check if searches array contains files i.e. the projects contains images
    if (project.searches && project.searches[0] && project.searches[0].files) {

        //check if project has enough images
        if (project.searches[0].files.length < imagesNeeded) {
            //will throw error and exit the template generation
            error('There needs to at least ' + imagesNeeded + ' images in the ' + project.name + ' project to use this template');
            break;
        }

        //add new spread of one page if more than one project
        if (spread !== 0) {
            indesign.addSpreads(1);
            indesign.addPages(1, 0);
        }

        //create array of the returned project images
        var images = project.searches[0].files;

        /**
         * INNER LOOP - IMAGES LOOP
         * - images are returned in files array
         * - image info that is returned is defined in the script json
         */
        for (var j = 0; j < images.length; j++) {

            //assign size with object of specified image size (in this case original)
            var image = images[j];
            var size = image.sizes.original;

            //check if image is valid
            if (size && size.width && size.height) {

                /**
                 * get reference to the frame on the template to put the image in
                 * @param {string} label - the label of the frame/box on the template where the image will be applied
                 */
                var imagePlaceholder = where().pageItems('image' + (j + 1));

                /**
                 * set for the existing content of the frame to be overridden
                 * @param {number} spread - the spread number that the frame is on
                 * @param {object} imagePlaceholder - the reference to the frame where the image will be applied
                 */
                indesign.overridePageItems(spread, imagePlaceholder);

                /**
                 * This is one of the Awesome Helper functions that are designed to simplify common InDesign template operations.
                 * A full list of them can be found in the AXO071 repo at JavaScript\Webpack\ProjectAwesome\Helpers
                 * @summary Create an OpenAsset InDesign Plugin compatible file path
                 * @param {number} id - the ID of the image in OpenAsset
                 * @param {string} md5 - the md5 of the image in OpenAsset
                 * @param {string} url - the url of the size to be added to the frame
                 */
                var imageLink = AwesomeHelpers.InDesign.generatePluginCompatibleFilePath(
                    image.id,
                    image.md5,
                    size.url
                );

                /**
                 * finally set the image to the frame
                 * @param {object} imageLink - the plugin compatible file path to the image
                 * @param {object} imagePlaceholder - the frame and spread on which to apply the image
                 */
                indesign.setImage(imageLink, imagePlaceholder.spreads(spread));

            } else {
                //a warning can be displayed if the size specified does not exist (template generation will continue)
                warning('Could not insert image ' + image.displayFields.filename + ' for project ' +
                    project.name + ' because the medium size does not exist');
            }

        }

    }

    //APPLY FIELDS

    /**
     * INNER LOOP - FIELDS LOOP
     * - will use the defined fieldCodes array to specify the fields we want
     */
    for (var j = 0; j < fieldCodes.length; j++) {

        var field = fieldCodes[j];

        //check if the value array for the specified field contains data, if not show the warning that
        //the field is empty
        if (project.fields[field].values[0]) {
            var value = project.fields[field].values[0];

            /**
             * dates are returned in the form '20170912104135' so the below code converts this
             * into a more readable format
             * 
             * ########################################################
             * ################## A NOTE ON FIELDS ####################
             * ########################################################
             * 
             * Project field data is returned as an object of the form
             * "Size": {
                 "dataType": "string",
                 "displayType": "singleLine",
                 "values": [
                   "© Copyright"
                 ],
                 "name": "Size"
               },
             * So here you can check on dataType to determine the type of data in the values array.
             * But file field data is returned in the form
             * "displayFields": {
                 "dateUploaded": "20170912104135",
                 "photographer": null,
                 "filename": "ABC003.jpg",
                 "caption": ""
               },
             * So you won't be able to check the dataType and the field data is NOT returned in the values array
             * but rather just as the value in the key-value pair
             */
            if (project.fields[field].dataType === 'date') {
                value = value.substr(6, 2) + '/' + value.substr(4, 2) + '/' + value.substr(0, 4);
            }

            //placeholder is defined and appendProjectDetails called to append the field value to the text box
            var projectFieldDataPlaceholder = where().pageItems('textBox' + fieldCodes[j]);
            appendProjectDetails(value, projectFieldDataPlaceholder, spread, 'Text');

        } else {
            warning('There is no data in the ' + fieldCodes[j] + ' field for project ' + project.name);
        }

        //APPLY KEYWORDS

        /**
         * INNER LOOP - KEYWORDS LOOP
         * - will use the defined keywordCodes array to specify the keywords we want
         * - project keywords are returned in the data object as data.projects.projectKeywords.categories
         */
        for (var j = 0; j < keywordCodes.length; j++) {

            //use [] to select current keywordCodes element from the categories object
            var keywordCategory = project.projectKeywords.categories[keywordCodes[j]] || {};
            var keywords = keywordCategory.keywords || [];

            //find out if any keywords for the current keyword category element exist
            if (keywords.length >= 1) {
                //add a ', ' after each keyword so that multiple keywords appear correctly spaced on the template
                for (var k = 0; k < keywords.length; k++) {
                    var pageItem = 'textBox' + keywordCodes[j];
                    var spacer = ', ';
                    //don't add a comma-space after the last keyword
                    if (k == keywords.length - 1) {
                        spacer = '';
                    }
                    //the keyword text itself is stored in the keywords['index'].name object
                    //apply this to the template with the spacer
                    appendProjectDetails(keywords[k].name + spacer, pageItem, 'Text');
                }
            } else {
                warning('There are no keywords for the ' + keywordCodes[j] + ' category for project ' + project.name);
            }

        }

    }

    //increment the spread count so that the next project is added to a new page
    spread++;

}

/**
 * creates a time stamp to use as part of the filename
 * @param {object} date - a new date object
 */
var nowTime = AwesomeHelpers.Generic.jsDateTo14DigitDate(new Date());

/**
 * save the file and send to browser to download
 * @param {string} filename - the file name to use for the idml file
 */
indesign.save('Single_Page_Project_Profile_' + nowTime + '.idml');
