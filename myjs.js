

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

			if(tmpObj.children === "0"){

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

	function getRoomString(roomObject){


		var str = "";

		str += roomObject.room + "-";

		for(var i=0;i<roomObject.roomconfig.length;i++){

			str += roomObject.roomconfig[i].adult;

			if(roomObject.roomconfig[i].children){
				
				str += "_" + roomObject.roomconfig[i].children;
				
				str += "_" + roomObject.roomconfig[i].age1;
				
				if(roomObject.roomconfig[i].children > 1){
					str += "_" + roomObject.roomconfig[i].age2;
				}

			}

			// if last room, ignore -
			if(i !== roomObject.roomconfig.length-1){

				str += "-";

			}
		}

		return str;

	}


	// summary printing
	function generateSummary(){

		// Fire Event for Pax Change.

		var tp = _.template($('#' + summaryTemplate).text());

		return tp(self);
	}


	function generateEdit(mode,obj,roomNumber){
		
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
		var ele = $('#'+ mainContainer+ ' #editBox div[ele]');
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

		$('#'+ mainContainer+ ' #summaryContainer').html(generateSummary());

		$('#'+ mainContainer+ ' #addButton').html(generateAdd());
		
		$('#'+ mainContainer+ ' #editBox').html('');

	}

	function editRoom(num){
		
		self.roomObject.roomconfig[num-1] = roomstringParser(getConfig()).roomconfig[0];

		if(self.roomString != getRoomString(self.roomObject)){

			console.log('changing')

			self.roomString = getRoomString(self.roomObject);
			
			$('#'+ mainContainer+ ' #summaryContainer').html(generateSummary());

		}

		$('#'+ mainContainer+ ' #editBox').html('');
	}

	function removeRoom(num){

		$('#'+ mainContainer+ ' #editBox').html('');

		self.roomObject.roomconfig.splice(num-1,1)

		$('#'+ mainContainer+ ' #summaryContainer').html(generateSummary());

		$('#'+ mainContainer+ ' #addButton').html(generateAdd());
	}	

	this.updatePax = function(rmstring){

		this.roomString = rmstring;

		this.roomObject = roomstringParser(rmstring);

		$('#'+ mainContainer+ ' #summaryContainer').html(generateSummary());
		$('#'+ mainContainer+ ' #editBox').html('');
		$('#'+ mainContainer+ ' #addButton').html(generateAdd());

	}

	this.getView = function(rmstring,containerHook){

		var container = containerHook || mainContainer;

		$('#'+ container+ ' #summaryContainer').html(generateSummary());
		$('#'+ container+ ' #editBox').html('');
		$('#'+ container+ ' #addButton').html(generateAdd());

	}

	function compareObject(obj1, obj2){

		console.log(JSON.stringify(obj1) === JSON.stringify(obj2))
		return ( JSON.stringify(obj1) === JSON.stringify(obj2) )

	}
	// 2 - 2_1_6 - 3_2_5_7

	this.roomString = rmstring;

	this.roomObject = roomstringParser(this.roomString);

	this.defaultRoomConfig = roomstringParser(defaultString);

	//summary print test
	$('#'+ mainContainer+ ' #summaryContainer').html(generateSummary());

	// Add button print Test
	$('#'+ mainContainer+ ' #addButton').html(generateAdd());

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
			$('#'+ mainContainer+ ' #editBox').html(generateEdit('edit',self.roomObject.roomconfig[nm-1],nm-1));
		}
	});

	$('#mainContainer').on('click','#editSubmit',function(e){

		var el = $('#'+ mainContainer+ ' #edtHook');

		if($(el).data('mode') == 'add'){

			addRoom();

		} else {

			editRoom($(el).data('serial'));

		}

	});


}





























