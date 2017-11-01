/**
 * ########################################################
 * ##### PROJECT-BASED TEMPLATE USING ZIP APPROACH ########
 * ########################################################
 * THIS IS THE SAME AS THE PROJECT-BASED INDESIGN TEMPLATE EXAMPLE BUT OUTPUTS FILES TO A ZIP
 * FOLDER INSTEAD OF CREATING A PLUGIN-COMPATIBLE FILE PATH
 * - this is useful in case users aren't plugin users (but in most cases they will be)
 */
var indesign = new InDesign(data.templates.v1);
var spread = 0;
var projects = data.projects;
var imagesNeeded = 2;

//a new Awesome Zip object is created
var zip = new Zip();

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


function appendProjectDetails(text, pageItem, spreadIndex, characterStyle) {
    var pageItemPlaceHolder = where().pageItems(pageItem);
    indesign.overridePageItems(spreadIndex, pageItemPlaceHolder);
    indesign.appendText(text, pageItemPlaceHolder.spreads(spreadIndex), characterStyle);
}


for (var i = 0; i < projects.length; i++) {

    if (project.searches && project.searches[0] && project.searches[0].files) {

        if (project.searches[0].files.length < imagesNeeded) {
            error('There needs to at least ' + imagesNeeded + ' images in the ' + project.name + ' project to use this template');
            break;
        }

        if (spread !== 0) {
            indesign.addSpreads(1);
            indesign.addPages(1, 0);
        }

        var images = project.searches[0].files;

        for (var j = 0; j < images.length; j++) {

            var image = images[j];
            var size = image.sizes.original;

            if (size && size.width && size.height) {

                //will remove all text of the path up to and including the last slash leaving
                //just the file name. Prepend 'Images/' as the template will read the images
                //from the relative Images folder that will be created
                var filepath = 'Images/' + size.url.replace(/.*\//,'');

                var imagePlaceholder = where().pageItems('image' + (j + 1));
                indesign.overridePageItems(spread, imagePlaceholder);
                indesign.setImage(imageLink, imagePlaceholder.spreads(spread));

                //create a new Awesome Image object and pass it the url of our image
                //add this image to our Zip object and set the file path, within the zip archive,
                //to the one we created
                var image = new Image(size.url);
                zip.add(filepath, image);

            } else {
                //a warning can be displayed if the size specified does not exist (template generation will continue)
                warning('Could not insert image ' + image.displayFields.filename + ' for project ' +
                    project.name + ' because the medium size does not exist');
            }

        }

    }

    for (var j = 0; j < fieldCodes.length; j++) {

        var field = fieldCodes[j];

        if (project.fields[field].values[0]) {
            var value = project.fields[field].values[0];

            if (project.fields[field].dataType === 'date') {
                value = value.substr(6, 2) + '/' + value.substr(4, 2) + '/' + value.substr(0, 4);
            }

            var projectFieldDataPlaceholder = where().pageItems('textBox' + fieldCodes[j]);
            appendProjectDetails(value, projectFieldDataPlaceholder, spread, 'Text');

        } else {
            warning('There is no data in the ' + fieldCodes[j] + ' field for project ' + project.name);
        }

        for (var j = 0; j < keywordCodes.length; j++) {

            var keywordCategory = project.projectKeywords.categories[keywordCodes[j]] || {};
            var keywords = keywordCategory.keywords || [];

            if (keywords.length >= 1) {
                for (var k = 0; k < keywords.length; k++) {
                    var pageItem = 'textBox' + keywordCodes[j];
                    var spacer = ', ';
                    if (k == keywords.length - 1) {
                        spacer = '';
                    }
                    appendProjectDetails(keywords[k].name + spacer, pageItem, 'Text');
                }
            } else {
                warning('There are no keywords for the ' + keywordCodes[j] + ' category for project ' + project.name);
            }

        }

    }

    spread++;

}

var nowTime = AwesomeHelpers.Generic.jsDateTo14DigitDate(new Date());

//add the indesign template object to the root of our zip archive and send it
//to the browser to be downloaded
zip.add('A4_English_' + nowTime + '.idml', indesign);
zip.save('A4_English_ZIP_' + nowTime + '.zip');
