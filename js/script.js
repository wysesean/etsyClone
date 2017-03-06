//CSS loading spinner provided by @tobiasahlin

console.log('Hello there')
var etsyKey = config.ETSY_KEY

                               
/*__      _______ ________          __
  \ \    / /_   _|  ____\ \        / /
   \ \  / /  | | | |__   \ \  /\  / / 
    \ \/ /   | | |  __|   \ \/  \/ /  
     \  /   _| |_| |____   \  /\  /   
      \/   |_____|______|   \/  \/ */


var MenuListView = Backbone.View.extend({
	el: 'div#leftContent',
	events:{
		'keydown #searchBar': '_runSearch',
		'click input#onSale': '_runToggles',
		'click input#hasImage': '_runToggles',
		'click input#postedWeek': '_runToggles'
	},
	_runToggles:function(){
		var salesToggleNode = document.querySelector('#onSale'),
			weekToggleNode = document.querySelector('#postedWeek'),
			keyWordStr = ''
		console.log(EtsyRouter.prototype)
		if(salesToggleNode.checked){
			keyWordStr = 'sale'
		}
		else{
			var keyWordStr = ''
		}
		if(weekToggleNode.checked){
			var weekStatus = 'created'
		}
		else{
			var weekStatus = 'score'
		}
		var searchParam =location.hash.substr(1).split('/')
		if(searchParam[0]==='search'){
			keyWordStr += searchParam[1]
		}
		showLoader()
		var data = {
            'includes' : 'Images',
			'api_key': etsyKey,
			'sort_on': 'score',
			'limit': '24',
			'sort_on': weekStatus,
		}
		if(keyWordStr){
			data.keywords = keyWordStr
		}
		var homeInstance = new ListCollection()
		homeInstance.fetch({
			dataType: 'jsonp',
			data

		})

		var homeViewInstance = new ListView({
			collection: homeInstance 
		})
	},
	_runSearch: function(e){
		console.log('search is working')
		var searchInput = e.target.value
		if(e.keyCode === 13){
			location.hash = "search/" + searchInput
			e.target.value = ''
		}
	},
})

//Displays a list of 
var ListView = Backbone.View.extend({
	el:'body',
	events:{
		'click img#listImg': '_runDetailView'
	},

	initialize: function(){
		this.listenTo(this.collection, 'change', this.render)
		this.listenTo(this.collection, 'sync', this.render)
	},

	_runDetailView: function(e){
		var imageNode = e.target
		location.hash = "detail/" + imageNode.getAttribute('listingid')
	},

	render: function(){
		hideLoader()
		var contentNode = document.querySelector('#rightContent')
		var html = ''
		var searchParam =location.hash.substr(1).split('/')
		if(searchParam[0]==='search'){
			html+='<p id="searchParameters">Showing results for: '+searchParam[1]+'</p>'
		}
		this.collection.forEach(function(inputCollection){
			console.log(this.collection)
			inputObj = inputCollection.attributes
			html+=	'<div id="listElement">'
			html+=			'<img id="listImg" listingid="'+inputObj.listing_id+'" src="'+inputObj.Images[0]['url_170x135']+'">'
			html+=			'<p id="listFormattedTitle">'+formatTitle(inputObj.title)+'</p>'
			// html+=			'<p id="listTitle">'+inputObj.title+'</p>'
			html+=			'<p id="listPrice"> $'+inputObj.price+'</p>'
			html+=	'</div>'
		})
		contentNode.innerHTML = html
	}
})


//Displays the details for an individual listing.
var DetailView = Backbone.View.extend({
	el:'body',
	events:{
		'click #leftContent':'goHome',
		'keydown ':'render.changePicture'
	},

	initialize: function(){
		// var contentNode = document.querySelector('#rightContent')
		// contentNode.innerHTML = ''
		this.listenTo(this.model, 'sync', this.render)
	},
	goHome: function(){
		location.hash = 'home'
	},
	render: function(){
		hideLoader()
		var contentNode = document.querySelector('#rightContent'),
			bodyNode = document.querySelector('body'),
			obj = this.model.attributes[0],
			detailGallery = new Gallery(this.model.attributes[0].Images),
			html = ''

		bodyNode.addEventListener('keydown',changePicture)



		console.log('hot models: ',this.model)
		
		html += '<div class="detailElement">'
		html += '<div id="imgGallery">'
		html += 	'<img id="detailImg" src="'+detailGallery.currentImg['url_570xN']+'">'
		html += 	'<div id="miniImgContainer">'
		for(var i=0; i<obj.Images.length; i++){
			html += '<img id="miniDetailImg" src="'+detailGallery.nextImg()['url_570xN']+'">'
		}
		html += 	'</div>'
		html += '</div>'
		html +=		'<p id="detailPrice"> $'+obj.price+'</p>'
		html +=		'<button id="detailBuyButton">Buy Now</button>'
		html +=		'<p id="arrows"><i id="leftArrow" class="material-icons">chevron_left</i><i id="rightArrow" class="material-icons">chevron_right</i></p>'

		html += 	'<p id="detailDescription">'+obj.description+'</p>'
		html += '</div>'
		contentNode.innerHTML = html

		var arrowLeftNode = document.querySelector('#leftArrow'),
			arrowRightNode = document.querySelector('#rightArrow')
		arrowRightNode.addEventListener('click', changePictureRight)
		arrowLeftNode.addEventListener('click', changePictureLeft)

		function changePictureRight(){
			var html = ''
			html += '<div class="detailElement">'
			html += '<div id="imgGallery">'
			html += 	'<img id="detailImg" src="'+detailGallery.nextImg()['url_570xN']+'">'
			html += 	'<div id="miniImgContainer">'
			for(var i=0; i<obj.Images.length; i++){
				html += '<img id="miniDetailImg" src="'+detailGallery.nextImg()['url_570xN']+'">'
			}
			html += 	'</div>'
			html += '</div>'
			html +=		'<p id="detailPrice"> $'+obj.price+'</p>'
			html +=		'<button id="detailBuyButton">Buy Now</button>'
			html +=		'<p id="arrows"><i id="leftArrow" class="material-icons">chevron_left</i><i id="rightArrow" class="material-icons">chevron_right</i></p>'

			html += 	'<p id="detailDescription">'+obj.description+'</p>'
			html += '</div>'
			contentNode.innerHTML = html

			var arrowLeftNode = document.querySelector('#leftArrow'),
				arrowRightNode = document.querySelector('#rightArrow')
			arrowRightNode.addEventListener('click', changePictureRight)
			arrowLeftNode.addEventListener('click', changePictureLeft)
		}
		function changePictureLeft(){
			var html = ''
			html += '<div class="detailElement">'
			html += '<div id="imgGallery">'
			html += 	'<img id="detailImg" src="'+detailGallery.nextImg()['url_570xN']+'">'
			html += 	'<div id="miniImgContainer">'
			for(var i=0; i<obj.Images.length; i++){
				html += '<img id="miniDetailImg" src="'+detailGallery.nextImg()['url_570xN']+'">'
			}
			html += 	'</div>'
			html += '</div>'
			html +=		'<p id="detailPrice"> $'+obj.price+'</p>'
			html +=		'<button id="detailBuyButton">Buy Now</button>'
			html +=		'<p id="arrows"><i id="leftArrow" class="material-icons">chevron_left</i><i id="rightArrow" class="material-icons">chevron_right</i></p>'

			html += 	'<p id="detailDescription">'+obj.description+'</p>'
			html += '</div>'
			contentNode.innerHTML = html

			var arrowLeftNode = document.querySelector('#leftArrow'),
				arrowRightNode = document.querySelector('#rightArrow')
			arrowRightNode.addEventListener('click', changePictureRight)
			arrowLeftNode.addEventListener('click', changePictureLeft)
		}

		function changePicture(e){
			var detailParam = location.hash.substr(1).split('/')
			if(e.keyCode === 39 && detailParam[0]==='detail'){
				
				var html = ''
				html += '<div class="detailElement">'
				html += '<div id="imgGallery">'
				html += 	'<img id="detailImg" src="'+detailGallery.nextImg()['url_570xN']+'">'
				html += 	'<div id="miniImgContainer">'
				for(var i=0; i<obj.Images.length; i++){
					html += '<img id="miniDetailImg" src="'+detailGallery.nextImg()['url_570xN']+'">'
				}
				html += 	'</div>'
				html += '</div>'
				html +=		'<p id="detailPrice"> $'+obj.price+'</p>'
				html +=		'<button id="detailBuyButton">Buy Now</button>'
				html +=		'<p id="arrows"><i id="leftArrow" class="material-icons">chevron_left</i><i id="rightArrow" class="material-icons">chevron_right</i></p>'

				html += 	'<p id="detailDescription">'+obj.description+'</p>'
				html += '</div>'
				contentNode.innerHTML = html

				var arrowLeftNode = document.querySelector('#leftArrow'),
					arrowRightNode = document.querySelector('#rightArrow')
				arrowRightNode.addEventListener('click', changePictureRight)
				arrowLeftNode.addEventListener('click', changePictureLeft)

			}
			if(e.keyCode === 37 && detailParam[0]==='detail'){
				var html = ''
				html += '<div class="detailElement">'
				html += '<div id="imgGallery">'
				html += 	'<img id="detailImg" src="'+detailGallery.nextImg()['url_570xN']+'">'
				html += 	'<div id="miniImgContainer">'
				for(var i=0; i<obj.Images.length; i++){
					html += '<img id="miniDetailImg" src="'+detailGallery.nextImg()['url_570xN']+'">'
				}
				html += 	'</div>'
				html += '</div>'
				html +=		'<p id="detailPrice"> $'+obj.price+'</p>'
				html +=		'<button id="detailBuyButton">Buy Now</button>'
				html +=		'<p id="arrows"><i id="leftArrow" class="material-icons">chevron_left</i><i id="rightArrow" class="material-icons">chevron_right</i></p>'

				html += 	'<p id="detailDescription">'+obj.description+'</p>'
				html += '</div>'
				contentNode.innerHTML = html

				var arrowLeftNode = document.querySelector('#leftArrow'),
					arrowRightNode = document.querySelector('#rightArrow')
				arrowRightNode.addEventListener('click', changePictureRight)
				arrowLeftNode.addEventListener('click', changePictureLeft)

			}
		}
	}
})

/*__  __  ____  _____  ______ _      
 |  \/  |/ __ \|  __ \|  ____| |     
 | \  / | |  | | |  | | |__  | |     
 | |\/| | |  | | |  | |  __| | |     
 | |  | | |__| | |__| | |____| |____ 
 |_|  |_|\____/|_____/|______|______|*/

//Stores the list of elements
var ListCollection = Backbone.Collection.extend({
	url: 'https://openapi.etsy.com/v2/listings/active.js',
	parse: function(apiResponse){
		console.log(apiResponse.results)
		return apiResponse.results
	}
})
 
//Stores the information for the single detail view 
var DetailModel = Backbone.Model.extend({
	//generate_url alters the api request's url
	//ID is the unique code for a list item. 
	_generate_URL: function(id){
		var fullURL= 'https://openapi.etsy.com/v2/listings/'+id+'.js'
		this.url = fullURL
	},
	parse: function(apiResponse){
		console.log('heres api',apiResponse)
		return apiResponse.results
	}
})



/*_____ ____  _   _ _______ _____   ____  _      _      ______ _____  
 / ____/ __ \| \ | |__   __|  __ \ / __ \| |    | |    |  ____|  __ \ 
| |   | |  | |  \| |  | |  | |__) | |  | | |    | |    | |__  | |__) |
| |   | |  | | . ` |  | |  |  _  /| |  | | |    | |    |  __| |  _  / 
| |___| |__| | |\  |  | |  | | \ \| |__| | |____| |____| |____| | \ \ 
 \_____\____/|_| \_|  |_|  |_|  \_\\____/|______|______|______|_|  \_\*/
var EtsyRouter = Backbone.Router.extend({
	routes:{
		'home': 'showHomeListPage',
		'search/:query': 'showSearchPage',
		'detail/:itemID': 'showDetailPage',
		'': 'setToHomePage',
		// '*default': 'showLeftMenu',
	},
	showLeftMenu: function(){
		var leftMenuInstance = new MenuListView()
	},
	setToHomePage: function(){
		location.hash = 'home'
	},
	showHomeListPage: function(){
		showLoader()
		var salesToggleNode = document.querySelector('#onSale'),
			weekToggleNode = document.querySelector('#postedWeek'),
			homeInstance = new ListCollection()
		if(salesToggleNode.checked ||  weekToggleNode.checked){
			var leftMenuInstance = new MenuListView()
			leftMenuInstance._runToggles()
			return
		}
		homeInstance.fetch({
			dataType: 'jsonp',
			data:{
                'includes' : 'Images',
				'api_key': etsyKey,
				'sort_on': 'score',
				'limit': '24' 
			}
		})

		var homeViewInstance = new ListView({
			collection: homeInstance 
		})
	},
	showSearchPage: function(query){
		showLoader()
		var searchInstance = new ListCollection()
		searchInstance.fetch({
			dataType: 'jsonp',
			data:{
                'includes' : 'Images',
				'api_key': etsyKey,
				'keywords': query,
				'sort_on': 'score',
				'limit': '24' 
			}
		})
		var searchViewInstance =  new ListView({
			collection: searchInstance
		})
	},
	showDetailPage: function(itemID){
		showLoader()
		console.log('detail has been summoned')
		var detailInstance = new DetailModel()
		detailInstance._generate_URL(itemID)
		detailInstance.fetch({
			dataType: 'jsonp',
			data:{
				'api_key': etsyKey,
				'includes': 'Images'
			}
		})
		var detailViewInstance = new DetailView({
			model: detailInstance
		})
	}
})     



/* ____ _______ _    _ ______ _____  
  / __ \__   __| |  | |  ____|  __ \ 
 | |  | | | |  | |__| | |__  | |__) |
 | |  | | | |  |  __  |  __| |  _  / 
 | |__| | | |  | |  | | |____| | \ \ 
  \____/  |_|  |_|  |_|______|_|  \_\*/
                                     
//Returns a cleaner title format for an image
function formatTitle(str){
    if(str.length > 30){ 
		var str = str.substr(0, 30)
	    str = str.substr(0,Math.min(str.length, str.lastIndexOf(" ")))
	    return str + "..."
    }
    return str
}

//Shows the loading spinner
function showLoader(){
	console.log('show loader')
	var loadNode = document.querySelector('.sk-circle')
		contentNode = document.querySelector('#rightContent')
	if(contentNode.innerHTML){
		contentNode.innerHTML = ''
	}
	loadNode.style.display = 'block';
}

//Hides the loading spinner
function hideLoader(){
	console.log('hide loader')
	var loadNode = document.querySelector('.sk-circle')
	loadNode.style.display = 'none';
}

//Constructor that acts as an image gallery holder

function Gallery(imgArr){
	this.imgArr = imgArr
    this.counter = 0
    this.currentImg = this.imgArr[this.counter]
    this.nextImg = function(){
    	if(this.counter < imgArr.length-1){
        	this.counter += 1
        	return this.imgArr[this.counter]
        }
        else{
            this.counter = 0
            return this.imgArr[this.counter]
        }
    }
    this.prevImg = function(){
    	if(this.counter > 1){
        	this.counter -= 1 
        	return this.imgArr[this.counter]
        }
        else{
        	this.counter = imgArr.length
        	return this.imgArr[this.counter]
        }
    }
}

function main(){
	showLoader()
	var instanceRouter = new EtsyRouter()
	instanceRouter.showLeftMenu()
	Backbone.history.start() 
}
main()
                                                                 
