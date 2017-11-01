//new InDesign object
//var indesign    = new InDesign('https://awesome-template-examples.openasset.com/InDesign/1_Page_Project_Profile_20161213_ADE.idml');
var indesign = new InDesign(data.templates.projectSheetNoImages);
var spread      = 0;
var projects    = data.projects;
//var imagesNeeded = 4;

var states = {  
                "Alabama":"AL",
                "Alaska":"AK",
                "Arizona":"AZ",
                "Arkansas":"AR",
                "California":"CA",
                "Colorado":"CO",
                "Connecticut":"CT",
                "Delaware":"DE",
                "Florida":"FL",
                "Georgia":"GA",
                "Hawaii":"HI",
                "Idaho":"ID",
                "Illinois":"IL",
                "Indiana":"IN",
                "Iowa":"IA",
                "Kansas":"KS",
                "Kentucky":"KY",
                "Louisiana":"LA",
                "Maine":"ME",
                "Maryland":"MD",
                "Massachusetts":"MA",
                "Michigan":"MI",
                "Minnesota":"MN",
                "Mississippi":"MS",
                "Missouri":"MO",
                "Montana":"MT",
                "Nebraska":"NE",
                "Nevada":"NV",
                "New Hampshire":"NH",
                "New Jersey":"NJ",
                "New Mexico":"NM",
                "New York":"NY",
                "North Carolina":"NC",
                "North Dakota":"ND",
                "Ohio":"OH",
                "Oklahoma":"OK",
                "Oregon":"OR",
                "Pennsylvania":"PA",
                "Rhode Island":"RI",
                "South Carolina":"SC",
                "South Dakota":"SD",
                "Tennessee":"TN",
                "Texas":"TX",
                "Utah":"UT",
                "Vermont":"VT",
                "Virginia":"VA",
                "Washington":"WA",
                "West Virginia":"WV",
                "Wisconsin":"WI",
                "Wyoming":"WY"
              };




function appendProjectDetails(text, pageItem, characterStyle){
    var pageItemPlaceolder = where().pageItems(pageItem);
    indesign.overridePageItems(spread, pageItemPlaceolder);
    indesign.appendText(text, pageItemPlaceolder.spreads(spread), characterStyle);
}


//loop through number of projects
for(var i = 0; i < projects.length; i++){

    var project = projects[i];
  
  	var factSheet = [];
  
  //add new spread of one page if more than one project
        if (spread !== 0) {
            indesign.addSpreads(1);
            indesign.addPages(1, 0);
        }
	
  /*
    //check if searches array continas files i.e. the projects contains images
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
	
        
	
      	var images = project.searches[0].files;
      
         //loop through total images in project
        for(var j = 0; j < images.length; j++){

            var image = images[j];
            var size = image.sizes.medium;

            //check if image is valid
            if(size && size.width && size.height){

                var imagePlaceholder = where().pageItems('imageRectangle' + (j+1));

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
        */
  	    //get Name Alias 2
        var name = '';
        if(project && project.name){
          
            name += project.name;
     
        } else {
          
            name += 'No Title available. Please add one.';
        }
  
        //get City => Keyword
        var subHeading = '';
      	if(project.fields && 
           project.fields.Owner &&
           project.fields.Owner.values[0] !== null &&
           project.fields.Owner.values[0] !== ''){
          
            subHeading += project.fields.Owner.values[0];
          
          
        }
      	
        var location = '';  
        if(project.projectKeywords &&
           project.projectKeywords.categories.City &&
           project.projectKeywords.categories.City.keywords[0].name !== null &&
           project.projectKeywords.categories.City.keywords[0].name !== ''){
          
           location += ' (' + project.projectKeywords.categories.City.keywords[0].name;
     
        }
  	
  		//get State => Keyword
  		if(location !== '' && project.projectKeywords &&
           project.projectKeywords.categories.State &&
           project.projectKeywords.categories.State.keywords[0].name !== null &&
           project.projectKeywords.categories.State.keywords[0].name !== ''){
           
           var value = project.projectKeywords.categories.State.keywords[0].name;
           location += ', ' + states[value] + ')';
          
        }else if(location !== '' && !(project.projectKeywords &&
                 project.projectKeywords.categories.State &&
                 project.projectKeywords.categories.State.keywords[0].name !== null &&
                 project.projectKeywords.categories.State.keywords[0].name !== '')){
          
          location += ')';	
          
        }else{
          
          	location += ' (' + project.projectKeywords.categories.State.keywords[0].name + ')';
        }
      
      	subHeading = subHeading + location;
  
  		//get project size => Field
        var size = 'Project Size\n';
  		
  		factSheet.push(size);
  		
        if(project.fields && 
           project.fields.Size &&
           project.fields.Size.values[0] !== null &&
           project.fields.Size.values[0] !== ''){
          
            size = project.fields.Size.values[0];
            size = Number(size).toLocaleString('en-US', {minimumFractionDigits: 0});
          	factSheet.push(size + ' SF\n');
          
        }else{
          
          	size = '\n';
          	factSheet.push(size);
          
        }
  
  		//get the Program Specifics (As per client, Using ProjectType for now) => Manual Entry
  		var programSpecifics = '\nProgram\n';
  
  		factSheet.push(programSpecifics);		
  
  		//Reset variable so we can build the string of keywords
         programSpecifics = '';
  
        if(project.projectKeywords.categories && 
           project.projectKeywords.categories.ProjectProgram &&
           project.projectKeywords.categories.ProjectProgram.keywords[0].name !== null &&
           project.projectKeywords.categories.ProjectProgram.keywords[0].name !== ''){
          
            var data = project.projectKeywords.categories.ProjectProgram.keywords;
          
           
          
          	for (var j = 0; j < data.length; j++) {
              
              programSpecifics += data[j].name + '\n';
              
            }
          
          factSheet.push(programSpecifics);
          
        }else{
          
          programSpecifics += '\n';
          factSheet.push(programSpecifics);
          
        }
  		
       //get the Services => Manual Entry
  		var services = '\nServices\n';
  
  		factSheet.push(services);
  
  		services = '';
  
  		if(project.projectKeywords.categories && 
           project.projectKeywords.categories.Services &&
           project.projectKeywords.categories.Services.keywords[0].name !== null &&
           project.projectKeywords.categories.Services.keywords[0].name !== ''){
          
            var data = project.projectKeywords.categories.Services.keywords;
          	var keyword = '';
          	for(var k = 0; k < data.length; k++){
              
              //Rewrite requested by client => change MEP Design to MEP/ FP Engineering
              keyword = (data[k].name == 'MEP Design') ? 'MEP / FP Engineering' : data[k].name;
              
          
              services += keyword + '\n';
              
            }
          
        }
  		
  		if(project.projectKeywords.categories && 
           project.projectKeywords.categories.AdditionalServices &&
           project.projectKeywords.categories.AdditionalServices.keywords[0].name !== null &&
           project.projectKeywords.categories.AdditionalServices.keywords[0].name !== ''){
          
            var data = project.projectKeywords.categories.AdditionalServices.keywords;
          
          	for(var l = 0; l < data.length; l++){
              
              services += data[l].name + '\n';
              
            }
          
        }
  		
        factSheet.push(services);
  
  		//get the Arhitect => Manual Entry
  		var architect = '\nArchitect\n';
  
  		factSheet.push(architect);
  
  		if(project.fields && 
           project.fields.Architect &&
           project.fields.Architect.values[0] !== null &&
           project.fields.Architect.values[0] !== ''){
          
            architect = project.fields.Architect.values[0] + '\n';
          	factSheet.push(architect);
          
        }else{
          
          	architect = '\n';
          	factSheet.push(architect);
          
        }
  
  
  		//get Owner 
  		var owner = '\nOwner\n';
  
  		factSheet.push(owner);
  
        if(project.fields && 
           project.fields.Owner2 &&
           project.fields.Owner2.values[0] !== null &&
           project.fields.Owner2.values[0] !== ''){
          
            owner = project.fields.Owner2.values[0] + '\n';
          	factSheet.push(owner);
          
        }else{
          
          	owner = '\n';
          	factSheet.push(owner);
        }
  
  		var awards = '\nAwards & Certifications\n';
  
  		factSheet.push(awards);
  	
  		//Reset variable so we can build the string of keywords
         awards = '';
        if(project.projectKeywords.categories && 
           project.projectKeywords.categories.Awards &&
           project.projectKeywords.categories.Awards.keywords &&
           project.projectKeywords.categories.Awards.keywords[0] !== null &&
           project.projectKeywords.categories.Awards.keywords[0] !== ''){
          	
          	
            var data = project.projectKeywords.categories.Awards.keywords;
          	
          	
          	for (var m = 0; m < data.length; m++) {
              
              awards += data[m].name + '\n';
              
            }
          
          factSheet.push(awards);
          
        }else{
          
          awards += '\n';
          factSheet.push(awards);
        }
  
  		//get project description => Field
        var projectDescription = '';
        if(project.fields && 
           project.fields.Description &&
           project.fields.Description.values[0] !== null &&
           project.fields.Description.values[0] !== ''){
          
            projectDescription = project.fields.Description.values[0];
            projectDescription = projectDescription.replace(/[\r\n]+/g, '\n');
          	projectDescription = projectDescription.replace(/^[\s]+/,'');
            //projectDescription = projectDescription.replace(/\x97/g, "-");
            //projectDescription = projectDescription.replace(/\xa0/g, "");
            //projectDescription = projectDescription.replace(/\u2022/g,"");
            projectDescription = projectDescription.replace(/’/g, "");
           // projectDescription = projectDescription.replace(/°/,'°');
        } else {
            projectDescription = 'No description data available.';
        }
  		
  		// Loop through the factsheet details array and insert formatted values into details box
  
  		var detailsText = '';
  
     	for(var n = 0; n < factSheet.length; n++){
          
          detailsText = factSheet[n];
          
          if (n % 2 === 0){ //Set even indices to "Subtitle 2: Bold" character style
            
            appendProjectDetails(detailsText, 'factSheet','Subtitle 2 Bold');
           
            
          }else{            //Set even indices to "Regurlar Text" character style
            
            appendProjectDetails(detailsText,'factSheet','Regular Text');
            
          }
          
        }
        // Insert project name and description
        appendProjectDetails(name, 'nameAlias2','Page Title');
  		appendProjectDetails(subHeading, 'location','Subtitle 2 Bold');
        appendProjectDetails(projectDescription, 'projectDescription','Regular Text');
  		
        
    //} else {
   //     warning('Could not create template as the project ' + project.name + ' contains no images!');
   // }

    spread++;

}

var nowTime = AwesomeHelpers.Generic.jsDateTo14DigitDate(new Date());
indesign.save('Single_Page_Project_Profile_' + nowTime + '.idml');
