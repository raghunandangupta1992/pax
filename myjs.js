

var paxWidget = function(rmstring,defaultString,summaryTemplate,editTemplate,addTemplate,mainContainer){

	var self = this;

	// Handler for change of Children

	var childHideShow = {

		"0" : function(){

			$('#childBox1').addClass('dn');
			$('#childBox2').addClass('dn');

		},
		"1" : function(){

			$('#childBox1').removeClass('dn');
			$('#childBox2').addClass('dn');

		},
		"2" : function(){
			
			$('#childBox1').removeClass('dn');
			$('#childBox2').removeClass('dn');

		}

	}

	// ------------------

	// - Get the Room String
	function roomstringParser(roomString){

		var ob = {};

		var arr = roomString.split('-')

		// check if required, else make array of rooms ( for .length )

		ob.room = arr[0];
		
		var tmpAry = [];

		for(var i = 1; i < arr.length; i++){

			var tmpObj = {}
			var tm = arr[i].split('_');

			tmpObj.adult = tm[0];

			tmpObj.children = tm[1];

			tmpObj.childTag = "Child"

			if(tmpObj.children === "1"){

				tmpObj['age1'] = '';
				tmpObj['age2'] = '';

			} else if(tmpObj.children === "1"){

				tmpObj['age1'] = tm[2];
				tmpObj['age2'] = '';

			} else if(tmpObj.children === "2") {

				tmpObj['age1'] = tm[2];
				tmpObj['age2'] = tm[3];

				tmpObj.childTag = "Children";

			}

			tmpAry.push(tmpObj);

		}
		ob.roomconfig = tmpAry;
		return ob;
	}
	// - END

	// summary printing
	function generateSummary(){

		var tp = _.template($('#' + summaryTemplate).text());

		return tp(self);
	}


	function generateEdit(mode,obj,roomNumber){
		
		console.log(obj,roomNumber)

		var tp = _.template($('#' + editTemplate).text());

		if(obj){
	
			obj.rmnumber = roomNumber;

		} else {
			self.defaultRoomConfig.roomconfig[0].rmnumber = self.roomObject.roomconfig.length;
			obj = self.defaultRoomConfig.roomconfig[0];
		}
		
		obj.mode = mode;
		
		return tp(obj);

	}

	function generateAdd(){

		var tp = _.template($('#' + addTemplate).text());

		return tp(self);

	}

	function getConfig(){

		var ele = $('#editBox div[ele]');
		var str = '1-';

		for(var i=0; i<ele.length; i++){

			if(!$(ele[i]).hasClass('dn')){

				if(i == 0){
					str += $(ele[i]).find('select').val();
				} else {
					str += '_'+$(ele[i]).find('select').val();
				}
			}

		}
		return str;

	}

	function addRoom(){

		self.roomObject.roomconfig.push(roomstringParser(getConfig()).roomconfig[0]);

		$('#summaryContainer').html(generateSummary());

		$('#addButton').html(generateAdd());
		
		$('#editBox').html('');

	}

	function editRoom(num){

		self.roomObject.roomconfig[num-1] = roomstringParser(getConfig()).roomconfig[0];

		$('#summaryContainer').html(generateSummary());

		$('#editBox').html('');
	}

	function removeRoom(num){

		$('#editBox').html('');

		self.roomObject.roomconfig.splice(num-1,1)

		$('#summaryContainer').html(generateSummary());

		$('#addButton').html(generateAdd());
	}	

	this.updatePax = function(rmstring){

		this.roomString = rmstring;

		this.roomObject = roomstringParser(rmstring);

		$('#summaryContainer').html(generateSummary());
		$('#editBox').html('');
		$('#addButton').html(generateAdd());

	}

	// 2 - 2_1_6 - 3_2_5_7

	this.roomString = rmstring;

	this.roomObject = roomstringParser(this.roomString);

	this.defaultRoomConfig = roomstringParser(defaultString);

	//summary print test
	$('#summaryContainer').html(generateSummary());

	// Add button print Test
	$('#addButton').html(generateAdd());

	$('#mainContainer').on('change','select[name=children]', function() {
	  		
	  	childHideShow[this.value]();

	});


	$('#mainContainer').on('click','#addRoom',function(){
		
		$('#editBox').html(generateEdit('add'));

	});

	$('#mainContainer').on('click','#summaryContainer',function(e){

		var nm = $(e.target).closest('.summary').data('serial');

		if(e.target.nodeName == "BUTTON"){

			removeRoom(nm);

		} else {

			// Edit print Test
			$('#editBox').html(generateEdit('edit',self.roomObject.roomconfig[nm-1],nm-1));
		}
	});

	$('#mainContainer').on('click','#editSubmit',function(e){

		var el = $('#edtHook');

		if($(el).data('mode') == 'add'){

			addRoom();

		} else {

			editRoom($(el).data('serial'));

		}

	});


}





























