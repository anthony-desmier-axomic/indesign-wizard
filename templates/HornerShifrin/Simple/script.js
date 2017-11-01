var indesign = new InDesign(data.templates.simpleParagraphTemplate);

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
                error('There needs to at least ' + imagesNeeded + ' image in the ' + project.name +' project to use this template');
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

                var imagePlaceholder = where().pageItems('image');

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

      //get Title
      	var title = project.name || 'No Data Available';
      //get Client
      	var client = (project.fields.ProjectOwner.values[0]) ? ' | ' + project.fields.ProjectOwner.values[0] + '\n' : '';
        
      
      //get project description
        var projectDescription = '';
        if(project.fields && project.fields.ConstMgmtFocusReference && project.fields.ConstMgmtFocusReference.values[0] !== null){
          
            projectDescription = project.fields.ConstMgmtFocusReference.values[0];
          
            projectDescription = projectDescription.replace(/\n’\n/g, "\n");
          	projectDescription = projectDescription.replace(/[\r\n]+/g,"\n");
          	projectDescription = projectDescription.replace(/^’/gm, "");
            projectDescription = projectDescription.replace(/’/g, "'");
            projectDescription = projectDescription.replace(/\u2022/g,'');
           
        } else {
            projectDescription = 'No description data available.\n';
        }
		
      //Design Completion Textbox
		var date = '';
        if(project.fields.ActualDesignCompletion.dataType === 'date' &&
            project.fields.ActualDesignCompletion.values[0] !== '' && 
            project.fields.ActualDesignCompletion.values[0] !== null && 
            project.fields.ActualDesignCompletion.values[0] !== "0"){
          
            date = project.fields.ActualDesignCompletion.values[0];
          
            date = date.substr(6, 2) + '/' + date.substr(4, 2) + '/' + date.substr(0, 4); // reverse the YMD format
          
        }else{
          
          date = 'No Data';
          
        }
      

      var constructionCost  = project.fields.ConstructionCost.values[0] || 'No Data';

      var reference = project.fields.ProjectSheetReference.values[0] || 'No Data';
      
      //remove double spacing for reference box data
      reference = reference.replace(/[\r\n]+/g,'\n');
       
        appendProjectDetails(title, 'title', 'ProjectTitle');
      	appendProjectDetails(client, 'title', 'ProjectTitle');
        appendProjectDetails(projectDescription, 'description', 'SidebarText');
      
      	appendProjectDetails(date, 'designCompletion', 'SidebarText');
      	appendProjectDetails(constructionCost, 'constructionCost', 'SidebarText');
        appendProjectDetails(reference, 'reference', 'SidebarText');
            

    } else {
        warning('Could not create template as the project ' + project.name + ' contains no images!');
    }

    spread++;

}

var nowTime = AwesomeHelpers.Generic.jsDateTo14DigitDate(new Date());
indesign.save('Single_Page_Project_Profile_' + nowTime + '.idml');
