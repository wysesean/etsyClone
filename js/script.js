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
			imageToggleNode = document.querySelector('#hasImage'),
			weekToggleNode = document.querySelector('#postedWeek')
		console.log(EtsyRouter.prototype)

		if(salesToggleNode.checked){
			console.log('sales toggle')
		}
		else{
			
		}
		if(imageToggleNode.checked){

		}
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

	initialize: function(){
		// var contentNode = document.querySelector('#rightContent')
		// contentNode.innerHTML = ''
		this.listenTo(this.model, 'sync', this.render)
	},
	render: function(){
		hideLoader()
		console.log('hot models: ',this.model)
		var obj = this.model.attributes[0]
		var contentNode = document.querySelector('#rightContent')
		var html = ''
		html += '<div class="detailElement">'
		html += 	'<img id="detailImg" src="'+obj.Images[0]['url_570xN']+'">'
		html +=		'<p id="detailPrice"> $'+obj.price+'</p>'
		html +=		'<button id="detailBuyButton">Buy Now</button>'
		html += 	'<p id="detailDescription">'+obj.description+'</p>'
		html += '</div>'
		contentNode.innerHTML = html
	}
})

/*__  __  ____  _____  ______ _      
 |  \/  |/ __ \|  __ \|  ____| |     
 | \  / | |  | | |  | | |__  | |     
 | |\/| | |  | | |  | |  __| | |     
 | |  | | |__| | |__| | |____| |____ 
 |_|  |_|\____/|_____/|______|______|*/
var ListCollection = Backbone.Collection.extend({
	url: 'https://openapi.etsy.com/v2/listings/active.js',
	parse: function(apiResponse){
		console.log(apiResponse.results)
		return apiResponse.results
	}
})
 
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
		var homeInstance = new ListCollection()
		homeInstance.fetch({
			dataType: 'jsonp',
			data:{
                'includes' : 'Images',
				'api_key': etsyKey,
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
				'keywords': query 
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

function showLoader(){
	console.log('show loader')
	var loadNode = document.querySelector('.sk-circle')
		contentNode = document.querySelector('#rightContent')
	if(contentNode.innerHTML){
		contentNode.innerHTML = ''
	}
	loadNode.style.display = 'block';
}

function hideLoader(){
	console.log('hide loader')
	var loadNode = document.querySelector('.sk-circle')
	loadNode.style.display = 'none';
}

function main(){
	showLoader()
	var instanceRouter = new EtsyRouter()
	instanceRouter.showLeftMenu()
	Backbone.history.start() 
}
main()
                                                                 
