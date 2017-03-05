console.log('Hello there')
var etsyKey = config.ETSY_KEY

                               
/*__      _______ ________          __
  \ \    / /_   _|  ____\ \        / /
   \ \  / /  | | | |__   \ \  /\  / / 
    \ \/ /   | | |  __|   \ \/  \/ /  
     \  /   _| |_| |____   \  /\  /   
      \/   |_____|______|   \/  \/ */
var ListView = Backbone.View.extend({
	el:'body',
	events:{
		'keydown input#searchBar': '_runSearch',
		'click img#homeImg': '_runDetailView',
		'click button#onSale': '_addCategorySale',
		'click button#hasImages': '_addCategoryImages',
		'click button#postWeek': '_addCategoryWeek'
	},

	initialize: function(){
		// var buttonNode = document.querySelector('#rightContent')
		// contentNode.innerHTML = ''

		this.listenTo(this.collection, 'sync', this.render)
	},

	_runSearch: function(e){
		console.log('search is working')
		var searchInput = e.target.value
		if(e.keyCode === 13){
			location.hash = "search/" + searchInput
		}
	},

	_runDetailView: function(e){
		var imageNode = e.target
		location.hash = "detail/" + imageNode.getAttribute('listingid')
	},

	_addCategorySale: function(){
		console.log('push my buttons1')
	},
	_addCategoryImages: function(){
		console.log('push my buttons2')
	},
	_addCategoryWeek: function(){
		console.log('push my buttons3')
	},

	render: function(){
		var contentNode = document.querySelector('#rightContent')
		var html = ''
		this.collection.forEach(function(inputCollection){
			inputObj = inputCollection.attributes
			html+=	'<div class="homeElement">'
			// html+=		'<a href="#details/'+inputObj.listing_id+'">'
			html+=			'<img id="homeImg" listingid="'+inputObj.listing_id+'" src="'+inputObj.Images[0]['url_570xN']+'">'
			html+=			'<p id="homeFormattedTitle">'+formatTitle(inputObj.title)+'</p>'
			html+=			'<p id="homeTitle">'+inputObj.title+'</p>'
			// html+=		'</a>'
			html+=			'<p id="homePrice"> $'+inputObj.price+'</p>'
			html+=	'</div>'
		})
		contentNode.innerHTML = html
	}
})


//Displays the details for an individual listing.
var DetailView = Backbone.View.extend({
	initialize: function(){
		var contentNode = document.querySelector('#rightContent')
		contentNode.innerHTML = ''
		this.listenTo(this.model, 'sync', this.render)
	},
	render: function(){
		console.log('hot models: ',this.model)
		var contentNode = document.querySelector('#rightContent')
		var html = ''
		html += '<div class="detailElement">'
		html += 	'<img src="'+this.model.attributes[0].Images[0]['url_570xN']+'">'
		html += 	'<p id="detailDescription">'+this.model.attributes[0].description+'</p>'
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
		'home': 'showHomePage',
		'search/:query': 'showSearchPage',
		'detail/:itemID': 'showDetailPage',
		'': 'setToHomePage'
	},
	setToHomePage: function(){
		location.hash = 'home'
	},
	showHomePage: function(){
		var homeInstance = new ListCollection()
		homeInstance.fetch({
			dataType: 'jsonp',
			data:{
                'includes' : 'Images',
				'api_key': etsyKey,
				'keywords': checkSale()
			}
		})

		var homeViewInstance = new ListView({
			collection: homeInstance 
		})
	},
	showSearchPage: function(query){
		var searchInstance = new ListCollection()
		searchInstance.fetch({
			dataType: 'jsonp',
			data:{
                'includes' : 'Images',
				'api_key': etsyKey,
				'keywords': query + checkSale()
			}
		})

		var searchViewInstance =  new ListView({
			collection: searchInstance
		})
	},
	showDetailPage: function(itemID){
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

function checkSale(){

}

function main(){
	new EtsyRouter()
	Backbone.history.start() 
}
main()
                                                                 
