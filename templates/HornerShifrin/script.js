//new InDesign object
var indesign    = new InDesign(data.templates.projectSheetTemplate);
var spread      = 0;
var projects    = data.projects;
var imagesNeeded = 1;

function appendProjectDetails(text, pageItem, characterStyle){
    var pageItemPlaceolder = where().pageItems(pageItem);
    indesign.overridePageItems(spread, pageItemPlaceolder);
    indesign.appendText(text, pageItemPlaceolder.spreads(spread), characterStyle);
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
            var size = image.sizes.medium;

            //check if image is valid
            if(size && size.width && size.height){

                var imagePlaceholder = where().pageItems('image' + (j+1));

                indesign.overridePageItems(spread, imagePlaceholder);

                var imageLink = AwesomeHelpers.InDesign.generatePluginCompatibleFilePath(
                    image.id,
                    image.md5,
                    size.url
                );

                indesign.setImage(imageLink, imagePlaceholder.spreads(spread));

            } else {
                warning('Could not insert image ' + image.displayFields.filename + ' for project ' +
                        project.name + ' because the medium size does not exist');
            }
        }

        
      //Project Name Header
      var projectName = project.name || 'No Data';
      appendProjectDetails(projectName, 'projectTitle', 'ProjectTitle');
       
      
     
      
      var details = [];
      
      //Highlights Textbox
      var highlight = '';
      highlight = (project.fields.ProjectSheetHighlight.values[0] !== null) ? project.fields.ProjectSheetHighlight.values[0] : 'No Data';
      highlight = highlight.replace(/\n’\n/g, "\n");
      highlight = highlight.replace(/[\r\n]+/g, '\n');
      
      details.push('Highlights\n');
      details.push(highlight + '\n\n');
      
      //Project Owner Textbox
      var projOwner = '';
      projOwner = project.fields.ProjectOwner.values[0] || 'No Data';
      
      details.push('Project Owner\n');
      details.push(projOwner + '\n\n');
      
      //Design Completion Textbox
      var designCompletion = '';
      if(project.fields.ActualDesignCompletion.dataType === 'date' &&
          project.fields.ActualDesignCompletion.values[0] !== '' && 
          project.fields.ActualDesignCompletion.values[0] !== null && 
          project.fields.ActualDesignCompletion.values[0] !== "0"){

          var date = project.fields.ActualDesignCompletion.values[0];

          designCompletion = date.substr(6, 2) + '/' + date.substr(4, 2) + '/' + date.substr(0, 4); // reverse the YMD format

      }else{

          designCompletion = 'No Data';

      }
      
      details.push('Design Completion\n');
      details.push(designCompletion + '\n\n');
      
      //Construction Cost
      var constructionCost = '';
      constructionCost = project.fields.ConstructionCost.values[0] || 'No Data';
      
      details.push('Construction Cost\n');
      details.push(constructionCost + '\n\n');
      
      //Project Location Textbox
      var location = '';
      location = (project.fields.LocationCity.values[0] + ', ' + project.fields.LocationState.values[0]) || 'No Data'; 
       
      details.push('Project Location\n');
      details.push(location + '\n\n');
      
      //Reference Textbox
      var reference = '';
      reference = project.fields.ProjectSheetReference.values[0] || 'No Data';
      reference = reference.replace(/\n’\n/g, "\n");
      reference = reference.replace(/[\r\n]+/g,'\n');
      //remove double spacing for reference box data
      
      	
      //Project Description Textbox
      var projectDescription = '';
      if(project.fields && project.fields.ProjectSheetDescription &&
         project.fields.ProjectSheetDescription.values[0] !== '' &&
         project.fields.ProjectSheetDescription.values[0] !== null){

          projectDescription = project.fields.ProjectSheetDescription.values[0];

          projectDescription = projectDescription.replace(/\n’\n/g, "\n"); // The quote is in reality a type of non-printing control character generated by 
																		   // Awesome reading a &nbsp; latin 1 byte as utf-8 which is an invalid character 
                                                                           // Latin1 (&nbsp) hex => \xA0
        																   // UTF-8  (&nbsp) hex => \xC2A0
          projectDescription = projectDescription.replace(/[\r\n]+/g, "\n");

          projectDescription = projectDescription.replace(/^’/gm, "");

          projectDescription = projectDescription.replace(/’/g, "'");
        
          projectDescription = projectDescription.replace(/\u2022/g,'');


      } else {
        
          projectDescription = 'No description available. Please add one.';
        
      }
      

      for (var k = 0; k < details.length; k++) {
          //var fieldDataPlaceholder = where().pageItems('textbox' + (k+1));
          //indesign.overridePageItems(spread,fieldDataPlaceholder);
          //indesign.appendText(values[k], fieldDataPlaceholder.spreads(spread), 'SidebarText'); 
      		if(k % 2 === 0){
              
              appendProjectDetails(details[k],'details','SidebarHeading');
              
            }else{
              
              appendProjectDetails(details[k],'details','SidebarText');
              
            }
      }
      
      appendProjectDetails(projectDescription, 'description', 'none');
            

    } else {
        warning('Could not create template as the project ' + project.name + ' contains no images!');
    }

    spread++;

}

var nowTime = AwesomeHelpers.Generic.jsDateTo14DigitDate(new Date());
indesign.save('Single_Page_Project_Profile_' + nowTime + '.idml');
