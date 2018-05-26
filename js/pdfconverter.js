$(document).ready(function() {
	$("#files").kendoUpload({
		select: onSelect,
		remove: onRemove
	});
	$('input[type="submit"]').prop('disabled', true);

	$('#CreatePDF').click(function(){
		$('#advice').addClass('pulser').text('Creating PDF files..');
		$.each($('li.k-file'), function(index, file){
			var fName = $(file).find('.k-filename').attr('title').replace('.jpg', '').replace('.png', '');
			kendo.drawing.drawDOM(file).then(function(group) {
		    	kendo.drawing.exportPDF(group).done(function(data){
		    		kendo.saveAs({
		    			dataURI: data,
		    			fileName: fName.concat('.pdf')
		    		});
		    	});
		    });
		});

		setTimeout(function(){
			$('#advice').removeClass('pulser').text('PDF files Created..!')
		}, 1500);
	});

	function onSelect(ev){
		$.each(ev.files, function (index, file) {
			var reader = new FileReader();
			reader.readAsDataURL(file.rawFile);
	        reader.onload = function (e) {
	           	CreatePreview(e.target.result, file);
	        }
        });
        $('input[type="submit"]').prop('disabled', false);
	}

	function onRemove(ev){
		if(($('li.k-file').length -1) == 0){
			$('input[type="submit"]').prop('disabled', true);
		}
		else{
			$('input[type="submit"]').prop('disabled', false);
		}
	}

	function CreatePreview(src, info){
		var fileList = $('li[data-uid='+info.uid+']');
		fileList.find('.k-filename').click(function(){
			var filename = this,
				originalName = $(this).clone().text(),
				name = prompt('Please enter the heading', originalName);

			if(name!= null){
				if(name.length > 0) $(this).text(name);
				else {
					$(this).text("Should have a Heading..!");
					setTimeout(function(){
						$(filename).text(originalName);
					}, 1000);
				}
			}
		}).text(fileList.find('.k-filename').text().replace('.jpg', '').replace('.png', ''));
		
		resizeBase64Img(src, 800, 500).then(function(newImg){
    		fileList.append($('<div/>', {class: 'preview'}).append(newImg));
		});
	}

	function resizeBase64Img(base64, width, height) {
	    var canvas = document.createElement("canvas");
	    canvas.width = width;
	    canvas.height = height;
	    var context = canvas.getContext("2d");
	    var deferred = $.Deferred();
	    $("<img/>").attr("src", base64).load(function() {
	        context.scale(width/this.width,  height/this.height);
	        context.drawImage(this, 0, 0); 
	        deferred.resolve($("<img/>").attr("src", canvas.toDataURL()));               
	    });
	    return deferred.promise();    
	}
});