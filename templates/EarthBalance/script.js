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
          var imageCount = project.searches[0].files.length;
            if(projects.length < 1){
                error('There needs to at least ' + imagesNeeded + ' images in the ' + project.name +' project to use this template');
                break;
            } else {
                warning('Only ' + imageCount + ' image detected in project "' + project.name +'"');
                //continue;
            }        
        }

        //add new spread of one page if more than one project
      
        if (spread !== 0) {
            indesign.addSpreads(1);
            indesign.addPages(1, 0);
        }

        //apply images to document
        var images = project.searches[0].files;
        var portraitFilled = 0;

        //loop through total images in project
        for(var j = 0; j < images.length; j++){

            var image = images[j];
            var size = image.sizes.original;

            //check if image is valid
            if(size && size.width && size.height){
              
                    if(j === 0){ //Take the first image and put it in the Portrait box

                      var imagePlaceholder = where().pageItems('image' + (j+2) + 'portrait');

                      indesign.overridePageItems(spread, imagePlaceholder);

                      var imageLink = AwesomeHelpers.InDesign.generatePluginCompatibleFilePath(
                          image.id,
                          image.md5,
                          size.url
                      );

                      indesign.setImage(imageLink, imagePlaceholder.spreads(spread));
                      portraitFilled = 1;

                    }else if(j === 1){ //Take the second image and put it in the first box to the left at the bottom 


                      var imagePlaceholder = where().pageItems('image' + (j));

                      indesign.overridePageItems(spread, imagePlaceholder);

                      var imageLink = AwesomeHelpers.InDesign.generatePluginCompatibleFilePath(
                          image.id,
                          image.md5,
                          size.url
                      );

                      indesign.setImage(imageLink, imagePlaceholder.spreads(spread));
                      portraitFilled = 1;


                    }else if(size.width > size.height && j === 1 && portraitFilled === 0 && false){ // No point in this logic bc portrait box
																									// is taken
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
      var projectName = project.name || 'No Data';
      appendProjectDetails(projectName, 'pName', 'projectName');
       
      var values = [];
      
      //Project Location
      var location = " ";
      var County = " ";
      var State = " ";
      
      if (project.projectKeywords.categories &&
          project.projectKeywords.categories.LocationCounty &&
          project.projectKeywords.categories.LocationCounty.keywords[0].name){
        
         County = project.projectKeywords.categories.LocationCounty.keywords[0].name;
      }
      
      if(County !== null){
        County = County.concat(", ");
      }else{
        County = 'No Data';
        County = County.concat(", ");
      }
     
      if (project.projectKeywords &&
          project.projectKeywords.categories &&
          project.projectKeywords.categories.LocationState &&
          project.projectKeywords.categories.LocationState.keywords &&
          project.projectKeywords.categories.LocationState.keywords[0].name){
        
      		State = project.projectKeywords.categories.LocationState.keywords[0].name;
      }
      if(State !== null){
        location = County.concat(State);
        location = location.concat("\n");
      }else{
        State = 'No Data';
        location = County.concat(State);
        location = location.concat("\n");
      }
      
      //Setting Project Location
      values[0] = location;
      
      
      //Setting Project Owner
      var pOwner = project.fields.ProjectOwner.values[0];
      if (pOwner !== null){
        values[1]  = pOwner.concat("\n");
      }else{
        values[1] = 'No Data'.concat("\n");
        
      }
      
      //Project Contact
      var contactString = "";
      var siteContact = "";
      var siteAddress = "";
      var siteAddressArray = "";
      var siteContactNumber = "";
      var siteContactEmail = "";
      siteContact = project.fields.SiteContact.values[0];
      siteAddress = project.fields.SiteAddress.values[0];
      siteContactNumber = project.fields.SiteContactNumber.values[0];
      siteContactEmail = project.fields.SiteContactEmail.values[0];
      
      //siteContact null check
      if (siteContact !== null){
        siteContact = siteContact.concat("\n");
      } else{
        siteContact = 'No Data';
        siteContact = siteContact.concat("\n");
      }
      
      //siteAddress null check
      if (siteAddress !== null){
        siteAddress = siteAddress.concat("\n");
      }else{
        siteAddress = 'No Data,No Data,No Data';
        siteAddress = siteAddress.concat("\n");
      }
      
      //Address String Creation
      siteAddressArray = siteAddress.split(",");
      
      //siteContactNumber null check
      if (siteContactNumber !== null){
      siteContactNumber = siteContactNumber.concat("\n");
      }else{
        siteContactNumber = 'No Data';
        siteContactNumber = siteContactNumber.concat("\n");
      }
      
      //siteContactEmail null check
      if (siteContactEmail !== null){
        siteContactEmail = siteContactEmail.concat("\n");
      }else{
        siteContactEmail = 'No Data';
        siteContactEmail = siteContactEmail.concat("\n");
      }
      
      contactString = siteContact;
      if(siteAddressArray !== null){
        contactString = contactString.concat(siteAddressArray[0], "\n");
        contactString = contactString.concat(siteAddressArray[1].trim(),",",siteAddressArray[2]);
        contactString = contactString.concat(siteContactNumber,siteContactEmail);
      }
      //Setting Project Contact
      values[2] = contactString;
      
      //Project EarthBalance Position
      var ebPosition = '';
      if (project.projectKeywords &&
          project.projectKeywords.categories &&
          project.projectKeywords.categories.CompanyPosition &&
          project.projectKeywords.categories.CompanyPosition.keywords &&
          project.projectKeywords.categories.CompanyPosition.keywords[0].name){
        
        ebPosition = project.projectKeywords.categories.CompanyPosition.keywords[0].name;
      }
      if(ebPosition !== null){
        ebPosition = ebPosition.concat("\n");
      }else{
        ebPosition = 'No Data';
        ebPosition = ebPosition.concat("\n");
      }
      //Setting EarthBalance Position
      values[3] = ebPosition;
      
      //Project Manager
      var projectManager = project.fields.ProjectManager.values[0];
      if(projectManager !== null){
        projectManager = projectManager.concat("\n");
      }else{
        projectManager = 'No Data';
        projectManager = projectManager.concat("\n");
      }
      //Setting Project Manager
      values[4] = projectManager;
      
      //Contract Amount
      var projContractAmount = project.fields.CompleteContractTotal.values[0];
      if(projContractAmount !== null){
        projContractAmount = projContractAmount.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        projContractAmount = "$".concat(projContractAmount.concat("\n"));
      }else{
        projContractAmount = 'No Data';
        projContractAmount = projContractAmount.concat("\n");
      }
      //Setting Contract Amount
      values[5] = projContractAmount;
      
      //Contract Dates
      var startDate = "";
      startDate = project.fields.EstimatedStartDate.values[0];
      var sYear = startDate.substr(0,4);
      var sMonth = startDate.substr(4,2);
      //var sDay = startDate.substr(6,2);
      
      switch(sMonth){
        case "01":
          sMonth = "January";
          break;
        case "02":
          sMonth = "February";
          break;
        case "03":
          sMonth = "March";
          break;
        case "04":
          sMonth = "April";
          break;
        case "05":
          sMonth = "May";
          break;
        case "06":
          sMonth = "June";
          break;
        case "07":
          sMonth = "July";
          break;
        case "08":
          sMonth = "August";
          break;
        case "09":
          sMonth = "September";
          break;
        case "10":
          sMonth = "October";
          break;
        case "11":
          sMonth = "November";
          break;
        case "12":
          sMonth = "December";
          break;
      }
      
      var endDate = "";
      endDate = project.fields.EstimatedEndDate.values[0];
      var eYear = endDate.substr(0,4);
      var eMonth = endDate.substr(4,2);
      //var eDay = endDate.substr(6,2);
            switch(eMonth){
        case "01":
          eMonth = "January";
          break;
        case "02":
          eMonth = "February";
          break;
        case "03":
          eMonth = "March";
          break;
        case "04":
          eMonth = "April";
          break;
        case "05":
          eMonth = "May";
          break;
        case "06":
          eMonth = "June";
          break;
        case "07":
          eMonth = "July";
          break;
        case "08":
          eMonth = "August";
          break;
        case "09":
          eMonth = "September";
          break;
        case "10":
          eMonth = "October";
          break;
        case "11":
          eMonth = "November";
          break;
        case "12":
          eMonth = "December";
          break;
      }
      var dates = sMonth.concat(", ",sYear," - ",eMonth,", ",eYear);
      //Setting Contract Dates
      values[6] = dates;
      
      //Project Description Textbox
      if(project.fields && project.fields.Description &&
         project.fields.Description.values[0] !== '' &&
         project.fields.Description.values[0] !== null){
        
          var projDescText = project.fields.Description.values[0];
               // projDescText = projDescText.replace(/£/, '\u00A3');
              //  projDescText = projDescText.replace(/€/, '\u20AC');
              //  projDescText = projDescText.replace(/©/, '\u00A9');
              //  projDescText = projDescText.replace(/™/, '\u2122');
              //  projDescText = projDescText.replace(/§/, '\u00A7');
              //  projDescText = projDescText.replace(/"/, '\u201C');
              //  projDescText = projDescText.replace(/"/, '\u201C');
                projDescText = projDescText.replace(/®/, '\u00AE');
                projDescText = projDescText.replace(/®/, '\u00AE');
                projDescText = projDescText.replace(/®/, '\u00AE');
                projDescText = projDescText.replace(/®/, '\u00AE');
                projDescText = projDescText.replace(/®/, '\u00AE');
                projDescText = projDescText.replace(/®/, '\u00AE');
                projDescText = projDescText.replace(/®/, '\u00AE');
                projDescText = projDescText.replace(/®/, '\u00AE');
                projDescText = projDescText.replace(/®/, '\u00AE');
        projDescText = projDescText.replace(/’/, '\u2019');
                projDescText = projDescText.replace(/“/, '\u201C');
                projDescText = projDescText.replace(/”/, '\u201C');
        projDescText = projDescText.replace(/’/, '\u2019');
                projDescText = projDescText.replace(/“/, '\u201C');
                projDescText = projDescText.replace(/”/, '\u201C');
        projDescText = projDescText.replace(/’/, '\u2019');
                projDescText = projDescText.replace(/“/, '\u201C');
                projDescText = projDescText.replace(/”/, '\u201C');
          
          values[7] = projDescText;
        
        } else {
            values[7] = 'No description available. Please add one.';
        }
      appendProjectDetails(values[0], 'projectInfo', 'projectDetailInfo');
      appendProjectDetails(values[1], 'projectInfo', 'projectDetailInfo');
      appendProjectDetails(values[2], 'projectInfo', 'projectDetailInfo');
      appendProjectDetails(values[3], 'projectInfo', 'projectDetailInfo');
      appendProjectDetails(values[4], 'projectInfo', 'projectDetailInfo');
      appendProjectDetails(values[5], 'projectInfo', 'projectDetailInfo');
      appendProjectDetails(values[6], 'projectInfo', 'projectDetailInfo');
      appendProjectDetails(values[7], 'pDescription', 'projectDescriptionInfo');
    } else {
        warning('Could not create template as the project ' + project.name + ' contains no images!');
    }
    spread++;
}

var nowTime = AwesomeHelpers.Generic.jsDateTo14DigitDate(new Date());
indesign.save('Single_Page_Project_Profile_' + nowTime + '.idml');
