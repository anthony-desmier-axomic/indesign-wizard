var indesign = new InDesign(data.templates.v1);
var spread      = 0;
var projects    = data.projects;
var imagesNeeded = 2;

function appendProjectDetails(text, pageItem, characterStyle){
    var pageItemPlaceHolder = where().pageItems(pageItem);
    indesign.overridePageItems(spread, pageItemPlaceHolder);
    indesign.appendText(text, pageItemPlaceHolder.spreads(spread), characterStyle);
}

//loop through number of projects
for(var i = 0; i < projects.length; i++){

    var project = projects[i];

    //check if searches array contains files i.e. the projects contains images
    if(project.searches && project.searches[0] && project.searches[0].files){
      
      	//check if project has enough images
        if(project.searches[0].files.length < imagesNeeded){
            if(projects.length <= 1){
                error('There needs to at least ' + imagesNeeded + ' images in the ' + project.name +' project to use this template');
                break;
            } else {
                warning('The project ' + project.name + ' needs to have at least ' + imagesNeeded + ' images');
                continue;
            }        
        }

        //add new spread of one page if more than one project
      
        if (spread !== 0) {
            indesign.addSpreads(1);
            indesign.addPages(1, 0);
        }

        //apply images to document
        var images = project.searches[0].files;

        //loop through total images in project
        for(var j = 0; j < images.length; j++){

            var image = images[j];
            var size = image.sizes.original;

            //check if image is valid
            if(size && size.width && size.height){
              if(size.height > size.width && j == 1){
                var imagePlaceholder = where().pageItems('image' + (j+1));


                var imageLink = AwesomeHelpers.InDesign.generatePluginCompatibleFilePath(
                    image.id,
                    image.md5,
                    size.url
                );

               // indesign.setImage(imageLink, imagePlaceholder.spreads(spread), {fit: 'FillProportionally', alignment:'CenterAnchor'});
                indesign.setImage(imageLink, imagePlaceholder.spreads(spread));
                
              }else{

                var imagePlaceholder = where().pageItems('image' + (j+1));

                indesign.overridePageItems(spread, imagePlaceholder);

                var imageLink = AwesomeHelpers.InDesign.generatePluginCompatibleFilePath(
                    image.id,
                    image.md5,
                    size.url
                );

                indesign.setImage(imageLink, imagePlaceholder.spreads(spread));
              }

            } else {
                warning('Could not insert image ' + image.displayFields.filename + ' for project ' +
                        project.name + ' because the medium size does not exist');
            }
        }
      
      //Project Name Header
      var projectStart = "PROJECT NAME AND LOCATION";
      appendProjectDetails(projectStart, 'projectTitle', 'project name and location');
      var projectName = " \n";
      projectName = projectName.concat(project.name);
      appendProjectDetails(projectName, 'projectTitle', 'project header');
      var projLocCity = "\n";
      projLocCity = projLocCity.concat(project.projectKeywords.categories.LocationCity.keywords[0].name);
      var projLocState = "";
      projLocState = projLocState.concat(project.projectKeywords.categories.LocationState.keywords[0].name);
      var location = projLocCity + ", " + projLocState;
      appendProjectDetails(location, 'projectTitle', 'body');
       
      var values = [];
      
      //Project Description Textbox
      if(project.fields && project.fields.LongDescription &&
         project.fields.LongDescription.values[0] !== '' &&
         project.fields.LongDescription.values[0] !== null){
        
          var projDescText = project.fields.LongDescription.values[0];
               // projDescText = projDescText.replace(/£/, '\u00A3');
              //  projDescText = projDescText.replace(/€/, '\u20AC');
              //  projDescText = projDescText.replace(/©/, '\u00A9');
              //  projDescText = projDescText.replace(/™/, '\u2122');
              //  projDescText = projDescText.replace(/§/, '\u00A7');
                projDescText = projDescText.replace(/’/, '\u2019');
                projDescText = projDescText.replace(/“/, '\u201C');
                projDescText = projDescText.replace(/”/, '\u201C');
        projDescText = projDescText.replace(/’/, '\u2019');
                projDescText = projDescText.replace(/“/, '\u201C');
                projDescText = projDescText.replace(/”/, '\u201C');
        projDescText = projDescText.replace(/’/, '\u2019');
                projDescText = projDescText.replace(/“/, '\u201C');
                projDescText = projDescText.replace(/”/, '\u201C');
        projDescText = projDescText.replace(/’/, '\u2019');
                projDescText = projDescText.replace(/“/, '\u201C');
                projDescText = projDescText.replace(/”/, '\u201C');
        projDescText = projDescText.replace(/’/, '\u2019');
                projDescText = projDescText.replace(/“/, '\u201C');
                projDescText = projDescText.replace(/”/, '\u201C');
        projDescText = projDescText.replace(/’/, '\u2019');
                projDescText = projDescText.replace(/“/, '\u201C');
                projDescText = projDescText.replace(/”/, '\u201C');

          
          values[0] = projDescText;
        if(projDescText.length > 1796){
          //values[0] = projDescText.slice(0,1796);
          //var projDesc2 = projDescText.slice(1796, projDescText.length);
          appendProjectDetails('Continued','botPage', 'turn line');
          indesign.addPages(1,1);
          //appendProjectDetails(projDesc2, 'projDesc2', 'body');
          var projectStart2 = "PROJECT NAME AND LOCATION";
          appendProjectDetails(projectStart2, 'botProjInfo', 'project name and location');
          var projectName2 = " \n";
          projectName2 = projectName2.concat(project.name);
          appendProjectDetails(projectName2, 'botProjInfo', 'project header');
          var projLocCity2 = "\n";
          projLocCity2 = projLocCity2.concat(project.projectKeywords.categories.LocationCity.keywords[0].name);
          var projLocState2 = "";
          projLocState2 = projLocState2.concat(project.projectKeywords.categories.LocationState.keywords[0].name);
          var location2 = projLocCity2 + ", " + projLocState2;
          appendProjectDetails(location2, 'botProjInfo', 'body');
          
        }
        appendProjectDetails(values[0],'projectInfo', 'body');
        
        } else {
            values[0] = 'No description available. Please add one.';
        }
    } else {
        warning('Could not create template as the project ' + project.name + ' contains no images!');
    }
    spread++;
}

var nowTime = AwesomeHelpers.Generic.jsDateTo14DigitDate(new Date());
indesign.save('Single_Page_Project_Profile_' + nowTime + '.idml');
