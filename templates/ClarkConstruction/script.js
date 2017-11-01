var indesign = new InDesign(data.templates.albumTemplate);
var spread =0;

//Issue: The linked project description boxes get treated as one box
//accross projects. Limiting template generation to one project at a time for now
for(var i = 0; i < 1; i++){
  
  //add new spread of one page if more than one project
    if (spread !== 0) {
        indesign.addSpreads(1);
        indesign.addPages(1, 0);
    }

    var project = data.projects[i];

    //check if search results have enough images
    if(project.searches.length >= 1){
 
      //loop through searches
      for(var j = 0; j < 10; j++){
       
          //check if searches array contains files i.e. the projects contains images
          if(project.searches[j] && project.searches[j].files.length > 0){

                //apply images to document
                var image = project.searches[j].files[0];
                var size  = image.sizes.medium;

                var imageBox = where().pageItems('image' + (j+1));

                indesign.overridePageItems(spread, imageBox);

                var imageLink = AwesomeHelpers.InDesign.generatePluginCompatibleFilePath(
                    image.id,
                    image.md5,
                    size.url
                );

                  indesign.setImage(imageLink,imageBox.spreads(spread),
                      {
                         fit: 	 'FillProportionally',
                         alignment:'CenterAnchor'
                      }
                  );


            } else {
                  warning('No image found with a rank of ' +  (j+1) + ' or greater for project ' + project.name);
                  continue;
            } 
      	}
      
     // 	var name  = (project.name !== '' && project.name !== null) ? project.name : 'No project name available, please add one.';
 		
      	
  		//warning("name length: " + name.length);
      
  		var location = '';
        	
        if (project.projectKeywords.categories.City &&
            project.projectKeywords.categories.City.keywords[0].name !== '' && 
            project.projectKeywords.categories.City.keywords[0].name !== null ){

            location = project.projectKeywords.categories.City.keywords[0].name;

        }

        if (location !== '' && project.projectKeywords.categories.State &&
            project.projectKeywords.categories.State.keywords[0].name !== '' && 
            project.projectKeywords.categories.State.keywords[0].name !== null){

            location += ', ' + project.projectKeywords.categories.State.keywords[0].name;

        }else if(location === '' && 
                 project.projectKeywords.categories.State &&
                 project.projectKeywords.categories.State.keywords[0].name !== '' && 
                 project.projectKeywords.categories.State.keywords[0].name !== null){

            location += project.projectKeywords.categories.State.keywords[0].name;

        }

        if (location !== '' && (location.includes(',') === false) &&
            project.projectKeywords.categories.Country &&
            project.projectKeywords.categories.Country.keywords[0].name !== '' &&
            project.projectKeywords.categories.Country.keywords[0].name !== null){

            location += ', ' + project.projectKeywords.categories.Country.keywords[0].name;  

        }                                          

        location = location.toUpperCase();
      
     //   var description = (project.fields.Description.values[0] !== '' && project.fields.Description.values[0] !== null) ? project.fields.Description.values[0] : '';
		//warning("desc: " + description);
        var discipline = '';
        if (project.projectKeywords.categories.Discipline &&
          	project.projectKeywords.categories.Discipline.keywords &&
            project.projectKeywords.categories.Discipline.keywords instanceof Array &&
            project.projectKeywords.categories.Discipline.keywords[0].name !== null){
          	
          	var collection = project.projectKeywords.categories.Discipline.keywords;
         	var length = collection.length;
          
        	for (var k = 0; k < length; k++ ){
              discipline += collection[k].name + "\n";
            }
          
          	discipline = discipline.replace(/\n$/, "");
          
        }else{
          
          discipline = 'No Data';
          
        }

    //    var architect  = (project.fields.Architect.values[0] !== '' && project.fields.Architect.values[0] !== null) ? project.fields.Architect.values[0] : '';

     //   var designArchitect = (project.fields.DesignArchitect.values[0] !== '' && project.fields.DesignArchitect.values[0] !== null) ? project.fields.DesignArchitect.values[0] :'';

   //     var theaterConsultant = (project.fields.TheaterConsultant.values[0] !== '' && project.fields.TheaterConsultant.values[0 !== null]) ? project.fields.TheaterConsultants : '';

      //  var seatCount = (project.fields.SeatCount1.values[0] !== '' && project.fields.SeatCount1.values[0] !== null) ? project.fields.SeatCount1.values[0] : '';

      //  var constructionAmount = (project.fields.ConstructionAmount.values[0] !== '' && project.fields.ConstructionAmount.values[0] !== null) ? project.fields.ConstructionAmount.values[0] : '';

       // var size = (project.fields.Size.values[0] !== '' && project.fields.Size.values[0] !== null) ? project.fields.Size.values[0] : '';

		var projCompletion = '';
  		if (project.projectKeywords.categories.ProjectCompletionYear &&
            project.projectKeywords.categories.ProjectCompletionYear.keywords[0].name !== null &&
            project.projectKeywords.categories.ProjectCompletionYear.keywords[0].name !==''){
          
         	projCompletion = project.projectKeywords.categories.ProjectCompletionYear.keywords[0].name;
          
          
        }else{
          
        	projCompletion = 'No Data';
          
        }
  
 /*
        if(project.fields.ProjectCompletion.dataType === 'date' && project.fields.ProjectCompletion.values[0] !== '' && project.fields.ProjectCompletion.values[0] !== null){
        	var value = project.fields.ProjectCompletion.values[0];
          	projCompletion = value.substr(0, 4);
        }else{
            projCompletion = 'No Data';
        }
 */     
       // var copyright = (project.fields.Copyright.values[0] !== '' && project.fields.Copyright.values[0] !== null) ? project.fields.Copyright.values[0] :'';
       
   /*   
  		appendProjectDetails(location, 'location', 'SmallText');
  		appendProjectDetails(description, 'description', 'MyText');
        appendProjectDetails(discipline, 'discipline', 'MyText');
  		appendProjectDetails(architect, 'architect', 'MyText');
  		appendProjectDetails(designArchitect, 'designArchitect', 'MyText');
  		appendProjectDetails(theaterConsultant, 'theaterConsultant', 'MyText');
  		appendProjectDetails(seatCount, 'seatCount', 'MyText');
  		appendProjectDetails(constructionAmount, 'constructionAmount', 'MyText');
  		appendProjectDetails(size, 'size', 'MyText');
  		appendProjectDetails(projCompletion, 'projCompletion', 'MyText');
   		appendProjectDetails(copyright, 'copyright', 'MyText');
 		appendProjectDetails(name, 'name', 'MyHeading');
        
*/
    }else{
      error('Could not create template as the project ' + project.name + ' contains no images!'); 
    }
 
        
  spread++;
}

var nowTime = AwesomeHelpers.Generic.jsDateTo14DigitDate(new Date());
indesign.save('Single_Page_Project_Profile_' + nowTime + '.idml');
