var app = angular.module('main', ['ui.router', 'oc.lazyLoad', 'ngCookies']);

    app.run( ['$rootScope', '$state', '$stateParams', '$http', '$cookies', function ($rootScope,   $state,   $stateParams, $http, $cookies) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.example = "";
        $rootScope.local = {};

        if($cookies.get('langCookieCode') == undefined){
            $rootScope.currentCountryCode = location.pathname.split("/")[1]
        }else {
            $rootScope.currentCountryCode = $cookies.get('langCookieCode');
        }
        console.log($rootScope.currentCountryCode)
        console.log(location.pathname)
        $rootScope.updateLang = function () {
            var langRequest = {
                method: 'GET',
                url: '/generate_language_content',
                params: {
                    langCode:$rootScope.currentCountryCode,
                    path : location.pathname
                },
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }}
            $http(langRequest).success(function (data) {
                $rootScope.pageContent = data;
            })
        }
        $rootScope.updateLang();

        if($cookies.get('temp_val')===undefined){
            $cookies.put('temp_val', 'C');
            $rootScope.local.typeTemp = 'C';
        }else {
            $rootScope.local.typeTemp = $cookies.get('temp_val').toString();

        }
        if($cookies.get('time_val')===undefined){
            $cookies.put('time_val', 24);
            $rootScope.local.typeTime = 24;
        }else {
            $rootScope.local.typeTime = $cookies.get('time_val').toString();

        }

        if(parseInt($cookies.get('time_val'))===24){
            $rootScope.local.timeRange = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
        }else {
            $rootScope.local.timeRange = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];
        }
        $rootScope.searchInput = '';
        $rootScope.searchList = [];
        $rootScope.result = 0;

        $rootScope.get_recent_cities_tabs_func = function(){
            $.ajax({
                  method: "POST",
                url: "/get_recent_cities_tabs"
            }).done(function( msg ) {
                $rootScope.$apply(function(){
                    $rootScope.get_recent_cities_tabs = msg;
                });
                if($('.favorite-location .container')[0]!= undefined) {
                    var ln = $('.favorite-location .container')[0]['children'].length;
                }
                if ($(window).width() < 500) {
                    if($stateParams.day === "front-page"){

                        $('#top-main').animate({height: '580px'});
                    }else {
                        $('#top-page').animate({height: (300+((ln) * 60))+'px'});
                    }
                }
            });
            // $('.tb-contant').removeClass('inner-html')

        }
        $rootScope.get_api_weather = function(){
            $.ajax({
                method: "POST",
                url: "/get_api_weather"
            }).done(function( msg ) {
                $rootScope.temperature = msg;
                $rootScope.get_recent_cities_tabs_func();
                $.ajax({
                    method: "GET",
                    url:"/get_selected_city"
                }).done(function (data) {
                    console.log(data)
                    $rootScope.selectedCity = data;

                })

                setTimeout(function () {
                    loadScript();
                }, 1000)

            })
        }

        $rootScope.get_api_weather();
        $rootScope.generate_meta_title = function () {

            var sendingTableRequest = {
                method: 'GET',
                url: '/generate_meta_title',
                params: {
                    path:location.pathname
                },
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }}

            $http(sendingTableRequest).success(function (data) {
                $rootScope.metaData = data;
            })
        }
        $rootScope.generate_meta_title();
        $rootScope.searchHint = function(){
            $('.search-dropdown ul').css({'display': 'none'})
            $('.search-dropdown img').css({'display': 'block'})
            // $('.search-dropdown').css({'display': 'block'})
                if($rootScope.searchInput.length > 1){

                     $.ajax({
                        method: "POST",
                        url: "/find_occurences/"+$rootScope.searchInput
                     }).done(function( msg ) {
                         $rootScope.$apply(function(){
                             $rootScope.searchList = msg;
                             $rootScope.result = 1;
                         });
                         $('.search-dropdown img').css({'display': 'none'})
                         $('.search-dropdown ul').css({'display': 'block'})


                     })
                }else{
                      $rootScope.searchList = $rootScope.get_recent_cities_tabs;
                      $rootScope.result = 0;
                        $('.search-dropdown img').css({'display': 'none'})
                        $('.search-dropdown ul').css({'display': 'block'})
                      if($rootScope.get_recent_cities_tabs===undefined){
                          // $('.search-dropdown').css({'display': 'none'})

                      }
                }
        }



        $rootScope.selectCity = function(e, e1, e2){
            $('.search-dropdown').removeClass('opened');
            $('.search-dropdown').css({'display': 'none'})
            $rootScope.searchInput = '';
            $('.ht-search-input input').val('')

            $rootScope.el=e;
            $rootScope.el1=e1;
            $rootScope.el2=e2;

            $.ajax({
            method: "POST",
                url: "/select_city/"+e
            }).done(function( msg ) {
                var url = document.location.pathname.split("/");
                $rootScope.selectedCity = msg.name+"_"+msg.countryCode;
                if(url.length>2){
                    if(document.URL.includes('_')){
                        url[url.length-1]=url[url.length-1].replace(url[url.length-1], msg.name+"_"+msg.countryCode);
                        url = url.join('/').replace('//','/')
                    }else{
                        url.push(msg.name+"_"+msg.countryCode)
                        url = url.join('/').replace('//','/');
                    }
                }else{
                    url = "/"+$rootScope.currentCountryCode+"/weather/"+msg.name+"_"+msg.countryCode;
                }
                if (history.pushState) {
                    var newurl = window.location.protocol + "//" + window.location.host + url;
                    window.history.pushState({path:newurl},'',newurl);
                }
                $state.reload();
                $rootScope.updateLang();
                $rootScope.get_api_weather();
                $('html, body').animate({
                    scrollTop: $('body').offset().top
                }, 1000);
            })

        };
        $rootScope.deleteCity = function(e, index){
            $.ajax({
                method: "POST",
                url: "/deleteCity/"+e
            }).done(function( msg ) {
                var $this = $(this);
                var $item = $('.weather-block-favorite')[0] ? $('.weather-block-favorite') : $('.weather-block-width');
                $this.parent().slideUp();
                var $menuIndex = index;
                var block_weater = $('.weather-block-favorite')[0] ? $('.weather-block-favorite') : $('.weather-block-width');
                if (!$('.weather-block-favorite')[0]) {
                    console.log('true');
                }
                $('.w' + $menuIndex).remove();
                $('.w' + $menuIndex + '_li').remove();

                var ln = $('.favorite-location .container')[0]['children'].length;
                if ($(window).width() < 500) {
                        $('#top-page').animate({height: (300+(ln * 50))+'px'});
                    $('#top-main').animate({height: '580px'});
                }
            })
        };
        $rootScope.selectLanguage = function (lan) {
            var curUrl = location.pathname.split('/');
            if(curUrl[1].length==2){
                location.pathname = location.pathname.replace(curUrl[1], lan);
            }else{
                $cookies.put('langCookieCode', lan);
                document.location.reload(true);
            }
        }
        $rootScope.updateTemp = function(val){
            if(val===$cookies.get('temp_val')){

            }
            else {
                if ($cookies.get('temp_val') === 'C') {
                    $cookies.put('temp_val', 'F');

                } else {
                    $cookies.put('temp_val', 'C');

                }
                document.location.reload(true);
            }
        }
        $rootScope.updateTime = function(val){
            if(val===$cookies.get('time_val')){

            }
            else {
                if (parseInt($cookies.get('time_val')) === 24) {
                    $cookies.put('time_val', 12);

                } else {
                    $cookies.put('time_val', 24);

                }
                document.location.reload(true);
            }

        }
        $rootScope.getTime = function(str){
            return changeTimeFormat(str, $rootScope.local.typeTime)
        }
    }]);
    app.config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', function($ocLazyLoadProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

          $ocLazyLoadProvider.config({
              'debug': false,
              'events': false,
              'modules': [{
                  name: 'outlook',
                  files: ['assets/js/outlook.js']
              }, {
                  name: 'today',
                  files: ['assets/js/today.js']
              },{
                  name: 'tomorrow',
                  files: ['assets/js/tomorrow.js']
              },{
                  name: 'past-weather',
                  files: ['assets/js/past-weather.js']
              },{   name: 'three-days',
                  files: ['assets/js/universal-days.js']
              },{   name: 'seven-days',
                  files: ['assets/js/universal-days.js']
              },{   name: 'five-days',
                  files: ['assets/js/not-universal-days.js']
              },{   name: 'ten-days',
                  files: ['assets/js/not-universal-days.js']
              },{   name: 'hour-by-hour',
                  files: ['assets/js/hour-by-hour.js']
              },{   name: 'fourteen-days',
                  files: ['assets/js/universal-days.js']
              },{   name: 'about',
                  files: ['assets/js/universal-days.js']
              },{   name: 'front-page',
                  files: ['assets/js/front-page.js']
              }, {
                  name: 'widgets',
                  files: ['assets/js/widgets.js']
              },{   name: 'map',
                  files: ['assets/js/temp-map.js']
              }]
          });

          $stateProvider
              .state('main', {
                  url: "/",
                  params:{
                      city: {squash: true, value: null},
                      "graph": "",
                      "day": "front-page",
                      "pos": "slash"
                  },
                  views: {
                      "": {
                          templateUrl: "templates/html/front-page.html"
                      }
                  },
                  resolve: {
                      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                          return $ocLazyLoad.load('front-page');
                      }]
                  }
              })
              .state('widgets', {
                  url: "/:lang/weather/widgets",
                  params:{
                      lang:{squash: true, value: null}
                  },
                  views: {
                      "": {
                          templateUrl: "templates/html/widgets.html"
                      }
                  },
                  resolve: {
                      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                          return $ocLazyLoad.load('widgets');
                      }]
                  }
              })
              .state('front-page', {
                  url: "/:lang/weather/:city",
                  params:{
                      lang:{squash: true, value: null},
                      city: {squash: true, value: null},
                      "graph": "",
                      "day": "front-page",
                      "pos": "main"
                  },
                  views: {
                      "": {
                          templateUrl: "templates/html/front-page.html"
                      }
                  },
                  resolve: {
                      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                          return $ocLazyLoad.load('front-page');
                      }]
                  }
              })
              .state('outlook', {
                  url: "/:lang/weather/outlook/:city",
                  params:{
                      lang:{squash: true, value: null},
                      city: {squash: true, value: null},
                      "graph": "weatherTen",
                      "day": "Outlook",
                      "graphTitle":"Detailed weather for 10 days"
                  },
                  views: {
                      "": {
                          templateUrl: "templates/html/outlook.html"
                      }
                  },
                  resolve: {
                      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                          return $ocLazyLoad.load('outlook');
                      }]
                  }
              })
              .state('today', {
                  url: "/:lang/weather/today/:city",
                  params:{
                      lang:{squash: true, value: null},
                      city: {squash: true, value: null},
                      "graph" : "weatherDetailed",
                      "day": "Today",
                      "graphTitle":"Hour by hour weather"
                  },
                  views: {
                      "": {
                          templateUrl: "templates/html/today.html"
                      }
                  },
                  resolve: {
                      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                          return $ocLazyLoad.load('today');
                      }]
                  }
              })
                .state('tomorrow', {
                        url: "/:lang/weather/tomorrow/:city",
                        params:{
                            lang:{squash: true, value: null},
                            city: {squash: true, value: null},
                            "graph" : "none",
                            "day": "Tomorrow"
                        },
                        views: {
                            "": {
                                templateUrl: "templates/html/tomorrow.html"
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('tomorrow');
                            }]
                        }
                    }) .state('past-weather', {
                        url: "/:lang/weather/history3/:city",
                          params:{
                              lang:{squash: true, value: null},
                              city: {squash: true, value: null},
                              "graph" : "weatherDetailed",
                              "day": "Past weather",
                              "hrs":3,
                              "graphTitle":"Weather for detailed day"
                          },
                        views: {
                            "": {
                                templateUrl: "templates/html/past-weather.html"
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('past-weather');
                            }]
                        }
                    }).state('past-weather1', {
                        url: "/:lang/weather/history1/:city",
                          params:{
                              lang:{squash: true, value: null},
                              city: {squash: true, value: null},
                              "graph" : "weatherDetailed",
                              "day": "Past weather",
                              "hrs":1,
                              "graphTitle":"Weather for detailed day"
                          },
                        views: {
                            "": {
                                templateUrl: "templates/html/past-weather.html"
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('past-weather');
                            }]
                        }
                    }).state('three-days', {
                        url: "/:lang/weather/3/:city",
                        params:{
                            lang:{squash: true, value: null},
                            city: {squash: true, value: null},
                            "index":3,
                            "tabClass" : "tabs tabs-three tb-tabs",
                            "page": "three-days",
                            "graph" : "weatherThree",
                            "day": "3 day",
                            "graphTitle": "weather for 3 days"
                        },
                        views: {
                            "": {
                                templateUrl: "templates/html/universal-days.html"
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('three-days');
                            }]
                        }
                    }).state('seven-days', {
                        url: "/:lang/weather/7/:city",
                        params:{
                            lang:{squash: true, value: null},
                            city: {squash: true, value: null},
                          "index":7,
                           "tabClass" : "tb-slider tabs tb-tabs tb-tabs-full",
                            "page": "seven-days",
                            "graph" : "weatherSeven",
                            "day": "7 day",
                            "graphTitle": "weather for 7 days"
                        },
                        views: {
                            "": {
                                templateUrl: "templates/html/universal-days.html"
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('seven-days');
                            }]
                        }
                    }).state('five-days', {
                        url: "/:lang/weather/5/:city",
                        params:{
                            lang:{squash: true, value: null},
                            city: {squash: true, value: null},
                          "index":5,
                            "page": "five-days",
                            "graph": "weatherFive",
                            "day": "5 day",
                            "graphTitle":"Weather for 5 days"

                        },
                        views: {
                            "": {
                                templateUrl: "templates/html/not-universal-days.html"
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('five-days');
                            }]
                        }
                    }).state('ten-days', {
                        url: "/:lang/weather/10/:city",
                        params:{
                            lang:{squash: true, value: null},
                            city: {squash: true, value: null},
                          "index":10,
                            "page": "ten-days",
                            "graph": "weatherTen",
                            "day": "10 day",
                            "graphTitle":"Weather for 10 days"
                        },
                        views: {
                            "": {
                                templateUrl: "templates/html/not-universal-days.html"
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('ten-days');
                            }]
                        }
                    }).state('hour-by-hour', {
                        url: "/:lang/weather/hour-by-hour3/:city",
                        params:{
                            lang:{squash: true, value: null},
                            city: {squash: true, value: null},
                          "index":7,
                            "day": "Hour by hour",
                            "hrs":3,
                            "graphTitle":"Hour by hour weather"
                            //"tabClass" : "tb-slider tabs tb-tabs tb-tabs-full"
                        },
                        views: {
                            "": {
                                templateUrl: "templates/html/hour-by-hour.html"
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('hour-by-hour');
                            }]
                        }
                    }).state('hour-by-hour1', {
                        url: "/:lang/weather/hour-by-hour1/:city",
                        params:{
                            lang:{squash: true, value: null},
                            city: {squash: true, value: null},
                          "index":7,
                            "day": "Hour by hour",
                            "hrs":1,
                            "graphTitle":"Hour by hour weather"
                            //"tabClass" : "tb-slider tabs tb-tabs tb-tabs-full"
                        },
                        views: {
                            "": {
                                templateUrl: "templates/html/hour-by-hour.html"
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('hour-by-hour');
                            }]
                        }

                    }).state('map', {
                          url: "/:lang/weather/map/:city",
                          params:{
                              lang:{squash: true, value: null},
                              city: {squash: true, value: null},
                              "index":7,
                              "day": "Map",
                              "hrs":1
                          },
                          views: {
                              "": {
                                  templateUrl: "templates/html/map.html"
                              }
                          },
                          resolve: {
                              loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                  return $ocLazyLoad.load('map');
                              }]
                          }
                     
                    }).state('fourteen-days', {
                        url: "/:lang/weather/14/:city",
                          params:{
                              lang:{squash: true, value: null},
                              city: {squash: true, value: null},
                              "index":14,
                              "tabClass" : "tb-slider tabs tb-tabs tb-tabs-full",
                              "page": "fourteen-days",
                              "graph" : "weatherFourteen",
                              "day": "14 day",
                              "graphTitle":"Long term weather"
                          },
                        views: {
                            "": {
                                templateUrl: "templates/html/universal-days.html"
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('fourteen-days');
                            }]
                        }
                    }).state('about', {
                        url: "/:lang/about",
                        params:{
                            lang:{squash: true, value: null}
                        },
                        views: {
                            "": {
                                templateUrl: "templates/html/about.html"
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('about');
                            }]
                        }
                    });
        $locationProvider.html5Mode({
            enabled: true,
            rewriteLinks: false
        })
  }]);

