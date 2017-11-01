var indesign = new InDesign(data.templates.a4EnglishV2);
//var zip = new Zip();
var spread = 0;
var images = data.albums[0].files;
var imagesNeeded = 3;

var fieldCodes = [
    'BGFGFA',
    'CompletionDate',
    'Description'
];

var keywordCodes = [
    'StadtCity',
    'LandCountry',
    'BauherrClient'
];

//FUNCTIONS

function convertToUnicode(text){

    // replaces 2+ newlines right next to each other with 1.
    text = text.replace(/[\r\n]{2,}/g, '\r\n');
    text = text.replace(/€/, '\u20AC');
    text = text.replace(/£/, '\u00A3');

    text = text.replace(/©/, '\u00A9');
    text = text.replace(/™/, '\u2122');
    text = text.replace(/§/, '\u00A7');
    text = text.replace(/“/, '\u201C');
    text = text.replace(/"/, '\u201C');
    text = text.replace(/Ü/, '\u00DC');
    text = text.replace(/ü/, '\u00FC');
    text = text.replace(/ß/, '\u00DF');
    text = text.replace(/Ä/, '\u00C4');
    text = text.replace(/ä/, '\u00E4');

    return text;
}

//need to have only 3 images
if(images.length !== imagesNeeded)
    error('You need to select ' + imagesNeeded + ' images to use this template');

if(images[0].displayFields.projectName)
{

  
//IMAGES
for(var i = 0; i < images.length; i++)
{

    //check if any images are reference images
    if(!images[i].displayFields.projectCode)
      error('Image '+ images[i].displayFields.filename + ' is not a project image. Please select only project images');

    //check if all images are from same project
    if(images[i].displayFields.projectCode !== images[0].displayFields.projectCode)
        error('Not all images are from the same project. Please select 3 images from the same project');


  	var image = images[i]; //dds for indescc
    var size = images[i].sizes.medium;
    //set file path ready to add to zip
    

    //check if image is valid
    if(size && size.width && size.height)
    {
        //place image on template
        var imagePlaceholder = where().pageItems('imageRectangle' + (i+1));
        warning(imagePlaceholder);
      	indesign.overridePageItems(spread, imagePlaceholder);
    

 		var imageLink = AwesomeHelpers.InDesign.generatePluginCompatibleFilePath
        (
            image.id,
            image.md5,
            size.url
        );

      	//ddsfor indescc
        indesign.setImage(imageLink, imagePlaceholder.spreads(spread));

    } else 
        warning('Could not insert image ' + images[i].displayFields.filename + ' because the medium size does not exist');
    
//FIELDS
    var count = 0;
    for(var j = 0; j < fieldCodes.length; j++)
    {

      var field = fieldCodes[j];

    //if values array contains data. index can be 0 as all images are from same project
      if(images[0].projectFields[field].values[0])
      {
        var value = images[0].projectFields[field].values[0];




        if(field === 'Description' && count === 0)
        {

          value = convertToUnicode(value);
          count++;
            //warning('Value is ' + value);
        }


        if(images[0].projectFields[field].dataType === 'date')
            value = value.substr(6, 2) + '/' + value.substr(4, 2) + '/' + value.substr(0, 4);

        var projectFieldDataPlaceholder = where().pageItems(fieldCodes[j] + 'Text');

        indesign.overridePageItems(spread, projectFieldDataPlaceholder);
        indesign.appendText(value, projectFieldDataPlaceholder.spreads(spread), 'FlieBtext');
    } 
    else 
        warning('There is no data in the ' + field + ' field for project ' + images[0].displayFields.projectName);

    }

    //KEYWORDS

    var location = '';

    for(var k = 0; k < keywordCodes.length; k++)
    {

      var keyword = keywordCodes[k];

      if(images[0].projectKeywords.categories[keyword] && images[0].projectKeywords.categories[keyword].keywords[0].name)
      {
        var value = images[0].projectKeywords.categories[keyword].keywords[0].name;
        value = convertToUnicode(value);

        switch(keywordCodes[k])
        {
            case 'StadtCity':
                location = value;
                break;
            case 'LandCountry':
                if(location === '')
                {
                    location = value;
                } 
                else 
                {
                    location += ', ' + value;
                }
                var projectKeywordDataPlaceholder = where().pageItems('locationText');
                indesign.overridePageItems(spread, projectKeywordDataPlaceholder);
                indesign.appendText(location, projectKeywordDataPlaceholder.spreads(spread), 'FlieBtext');
                break;
            case 'BauherrClient':
                var projectKeywordDataPlaceholder = where().pageItems('clientText');
                indesign.overridePageItems(spread, projectKeywordDataPlaceholder);
                indesign.appendText(value, projectKeywordDataPlaceholder.spreads(spread), 'FlieBtext');
                break;
        }

    } 
    else 
    {
        warning('There is no data for the ' + keyword + ' keyword for project ' + images[0].displayFields.projectName);
    }
}

}
}
  else 
  	{
    error('Image '+ images[0].displayFields.filename + ' is not a project image. Please select only project images');
	}

//SET PROJECT TITLE
var projectTitle = images[0].displayFields.projectName;
var projectFieldDataPlaceholder = where().pageItems('projectTitle');
indesign.overridePageItems(spread, projectFieldDataPlaceholder);
indesign.appendText(projectTitle, projectFieldDataPlaceholder.spreads(spread), 'Uberschrift');


//get curent date
//var nowTime = AwesomeHelpers.Generic.jsDateTo14DigitDate(new Date());
//add images to zip and save
//zip.add('A4_English_' + nowTime + '.idml', indesign);
//zip.save('A4_English_ZIP_' + nowTime + '.zip');
//indesign.save('A4_English_' + nowTime + '.idml', indesign);
