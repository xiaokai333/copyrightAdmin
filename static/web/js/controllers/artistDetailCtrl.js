/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-07-04 11:30:36
 * @version $Id$
 */
index.controller('artistsDetailCtrl', ['$scope','$stateParams','getMsg','userInfo', function($scope,$stateParams,getMsg,userInfo){
	$scope.user=userInfo.data

	// 艺术家信息数据获取
	getMsg.do('artist/all/info/'+$stateParams.artistID).then(function(res){
		if(res.status===200){
			// console.log(res)
			$scope.mainData=res.data.artist_data;
			$scope.mainData2=res.data.authorize_data;
		}
	})

	
}])
