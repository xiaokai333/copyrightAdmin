/**
 * 
 * @date    2017-07-03 15:45:23
 * @version $Id$
 */
var index = angular.module('index', ['ui.router']);

    // 环境
    // index.constant('IPprefix','http://172.16.7.235:8000/');
    index.constant('IPprefix','http://dev.artally.com.cn/copyright/');
    //账户信息
    index.constant('userInfo',JSON.parse(sessionStorage.getItem("userInfo")));

index.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	$stateProvider
        // 左侧悬浮菜单页
        .state('tabs', {
            url: '/tabs',
            views: {
                'tabs': {
                    templateUrl: 'tabs/tabs.html',
                    controller:'tabCtrl'
                }
            }
        })
        // 艺术家档案
        .state('tabs.artistsFiles/list', {
            url: '/artistsFiles/list',
            views: {
                'module': {
                    templateUrl: 'artistsFiles/list.html',
                    controller:'artistsFilesListCtrl'
                }
            }
        })
        .state('tabs.artistsFiles/artist', {
            url: '/artistsFiles/artist/:artistID',
            views: {
                'module': {
                    templateUrl: 'artistsFiles/artist.html',
                    controller:'artistsCtrl'
                }
            }
        })
        .state('tabs.artistsFiles/copyright', {
            url: '/artistsFiles/copyright/:artistID',
            views: {
                'module': {
                    templateUrl: 'artistsFiles/copyright.html',
                    controller:'artistsCopyrightCtrl'
                }
            }
        })
        .state('tabs.artistsFiles/detail', {
            url: '/artistsFiles/detail/:artistID',
            views: {
                'module': {
                    templateUrl: 'artistsFiles/detail.html',
                    controller:'artistsDetailCtrl'
                }
            }
        })
        //艺术品版权管理
        .state('tabs.artwork/list', {
            url: '/artwork/list',
            views: {
                'module': {
                    templateUrl: 'artwork/list.html',
                    controller:'artworkListCtrl'
                }
            }
        })
        .state('tabs.artwork/accredit', {
            url: '/artwork/accredit/{artworkId}',
            views: {
                'module': {
                    templateUrl: 'artwork/accredit.html',
                    controller:'artworkAccreditCtrl'
                }
            }
        })
        .state('tabs.artwork/artwork', {
            url: '/artwork/artwork/{artworkId}',
            views: {
                'module': {
                    templateUrl: 'artwork/artwork.html',
                    controller:'artworkMsgCtrl'
                }
            }
        })
        .state('tabs.artwork/detail', {
            url: '/artwork/detail/{artworkId}',
            views: {
                'module': {
                    templateUrl: 'artwork/detail.html',
                    controller:'artworkDetailCtrl'
                }
            }
        })
        .state('tabs.artwork/request', {
            url: '/artwork/request/{artworkId}',
            views: {
                'module': {
                    templateUrl: 'artwork/request.html',
                    controller:'artworkRequestCtrl'
                }
            }
        })
        // 版权使用审批
        .state('tabs.copyrightAllow', {
            url: '/copyrightAllow',
            views: {
                'module': {
                    templateUrl: 'copyrightAllow/copyrightAllow.html',
                    controller:'copyrightAllowCtrl'
                }
            }
        })
        //业务数据
        .state('tabs.business/list', {
            url: '/business/list',
            views: {
                'module': {
                    templateUrl: 'business/list.html',
                    controller:"businessListCtrl"
                }
            }
        })
        .state('tabs.business/add', {
            url: '/business/add',
            views: {
                'module': {
                    templateUrl: 'business/add.html',
                    controller:"businessAddCtrl"
                }
            }
        })
        //艺术家收入核算
        .state('tabs.income/list', {
            url: '/income/list',
            views: {
                'module': {
                    templateUrl: 'income/list.html',
                    controller:"incomeCtrl"
                }
            }
        })
	$urlRouterProvider.otherwise('/tabs/artistsFiles/list');
}])

