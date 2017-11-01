    // size to use
    var sizeToUse = 'medium';

    // load the template
    var indesign = new InDesign('http:' + AwesomeHelpers.System.getCloudScriptDataDirectory() + '/BPR001_1.idml');
     // spread count
    var spread = 0;
    // error count for warning dialogue
    var errorCount = 0;


	var files = data.albums[0].files;
    for (var i=0; i<files.length; i++) {
        var file = files[i];

        var displayFields = file.displayFields || {};
        var projectFields = file.projectFields || {};
        var projectCodeField   = displayFields.projectCode || {};
        var size = file.sizes[sizeToUse];
        var text = {
            ProjectName: displayFields.projectName || ''
        };




        if (size && size.width && size.height) {
            var url = size.url;

            var projectNameField = displayFields.projectNameAlias1 || displayFields.projectName;
            if (projectNameField) { 
                // page insertion, if not the first page (first page already exists in doc)
                if (spread !== 0) {
                    indesign.addSpreads(1);
                    indesign.addPages(1, 0);
                }

                var landscapeImagePlaceholder = where().pageItems('imageLandscape');

                indesign.overridePageItems(
                    spread,                     // the current spread we're on
                    landscapeImagePlaceholder   // the page item to override
                );

                var imageLink = AwesomeHelpers.InDesign.generatePluginCompatibleFilePath(
                    file.id,                    // id of the image
                    file.md5,                   // md5 of the image
                    url                         // the full url to the size we're using
                );

                indesign.setImage(
                    imageLink,
                    landscapeImagePlaceholder.spreads(spread),
                    {
                        fit:        'FillProportionally',
                        alignment:  'CenterAnchor'
                    }
                );

            } else { // If image is reference based it won't be included
                errorCount = errorCount + 1;
              	if (files[0].displayFields.projectCode === null){
                  error('Your first image in the selection is reference based. Please remove it ');
                }
            }

            // do some text
            var projectNamePlaceholder = where().pageItems('projectNameAlias');
            var projectDescriptionPlaceholder = where().pageItems('projectDescription');
            var projectCodePlaceholder = where().pageItems('projectCode');

            var projectNamePlaceholderOnSpread = projectNamePlaceholder.spreads(spread);
            var projectDescriptionPlaceholderOnSpread = projectDescriptionPlaceholder.spreads(spread);
            var projectCodePlaceholderOnSpread = projectCodePlaceholder.spreads(spread);

            indesign.overridePageItems(
                spread,
                projectNamePlaceholder
            );

            if (projectNameField) { 
                indesign.appendText(
                projectNameField,
                projectNamePlaceholderOnSpread
                );
            }

            indesign.overridePageItems(
                spread,
                projectCodePlaceholder
            );

            if (projectCodeField) { 
                indesign.appendText(
                projectCodeField,
                projectCodePlaceholderOnSpread
                );
            }


            indesign.overridePageItems(
                spread,
                projectDescriptionPlaceholder
            );

            if  (projectFields.LongDescription && projectFields.LongDescription.values) {
                var projDescText = projectFields.LongDescription.values[0] || '';
                // replaces 2+ newlines right next to each other with 1. 
                projDescText = projDescText.replace(/[\r\n]{2,}/g, '\n\n');
              
                projDescText = projDescText.replace(/£/, '\u00A3');
                projDescText = projDescText.replace(/€/, '\u20AC');           
                projDescText = projDescText.replace(/©/, '\u00A9');
                projDescText = projDescText.replace(/™/, '\u2122');
                projDescText = projDescText.replace(/§/, '\u00A7');
                projDescText = projDescText.replace(/“/, '\u201C');
                projDescText = projDescText.replace(/"/, '\u201C');
             
                indesign.appendText(
                    projDescText,
                    projectDescriptionPlaceholderOnSpread
                );
        }



        for (var j=1;j<=9;j++) {
            var fieldTitlePlaceholder   = where().pageItems('fieldTitle' + j);
            var fieldBodyPlaceholder    = where().pageItems('fieldBody' + j);

            var fieldTitlePlaceholderOnSpread   = fieldTitlePlaceholder.spreads(spread);
            var fieldBodyPlaceholderOnSpread    = fieldBodyPlaceholder.spreads(spread);

            indesign.overridePageItems(
                spread,
                fieldTitlePlaceholderOnSpread               
            );

            var fieldNames = ['blob', 'Field1Title', 'Field2Title', 'Field3Title', 'Field4Title', 'Field5Title', 'Field6Title', 'Field7Title', 'Field8Title', 'Field9Title'];
            var fieldName = fieldNames[j];
                    // fields
            if (projectFields[fieldName]) {
                text[fieldName] = projectFields[fieldName].values[0];
                indesign.appendText(
                    text[fieldName],
                    fieldTitlePlaceholderOnSpread
                );

            } else {
                text[fieldName] = '';
            }

            indesign.overridePageItems(
                spread,
                fieldBodyPlaceholderOnSpread               
            );

            var bodyNames = ['blob', 'Field1', 'Field2', 'Field3', 'Field4', 'Field5', 'Field6', 'Field7', 'Field8', 'Field9'];
            var bodyName = bodyNames[j];
                    // fields
            if (projectFields[bodyName]) {
                text[bodyName] = projectFields[bodyName].values[0];
                
                if (text[bodyName]) {
                          // replaces 2+ newlines right next to each other with 1. 
                    text[bodyName] = text[bodyName].replace(/[\r\n]{2,}/g, '\n');
                    text[bodyName] = text[bodyName].replace('£', '\u00A3');
                  text[bodyName] = text[bodyName].replace('£', '\u00A3');
                }
                indesign.appendText(
                    text[bodyName],
                    fieldBodyPlaceholderOnSpread
                );

            } else {
                text[bodyName] = '';
            } 

        }
        spread++;
        }

    }
	if (errorCount > 0){
    	warning(errorCount + ' images were not project images and so were omitted');
    }

    var nowTime = AwesomeHelpers.Generic.jsDateTo14DigitDate(new Date());
    indesign.save('BPR_' + nowTime + '.idml');