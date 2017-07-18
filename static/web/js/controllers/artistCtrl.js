/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-07-04 11:16:46
 * @version $Id$
 */
index.controller('artistsCtrl', ['$scope','$stateParams','getMsg','$http','IPprefix','$state','postJson','$http','showModal','$location', function($scope,$stateParams,getMsg,$http,IPprefix,$state,postJson,$http,showModal,$location){
	$scope.saveBTN='保存并下一步';
	$scope.mainData={
		'name':'',
		'name_pinyin':'',
		'study_direction':'',
		'organization':'',
		'phone':'',
		'IDcard':'',
		'description':'',
		'exhibit_log':'',
		'collect_record':''
	}
    // 个人头像选择事件
    $scope.updateHead=function(files){ 
    	$scope.headerPic=files[0]
		let reader = new FileReader();   //创建一个FileReader接口
    	reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
        reader.onload = function(ev) {
			$scope.$apply(function(){
               	$scope.mainData.head = ev.target.result; // img接收
				$scope.headFlag=false;
    			// $scope.headerPic=ev.target.result
            });
        };
    }
	// 判断艺术家ID
	if(isFinite($stateParams.artistID)){
		$scope.saveBTN='保存';
		$scope.headFlag=false;
		// 列表数据获取
		getMsg.do('artist/detail/'+$stateParams.artistID).then(function(res){
			if(res.status===200){
				// console.log(res)
				$scope.mainData=res.data.data
			}
		})
		// 保存并下一步,编辑艺术家信息
		$scope.save=function(){
			var send = new FormData();
			if($scope.headerPic!=undefined){
	        	send.append('head', $scope.headerPic); 
		    }
			send.append('name',$scope.mainData.name)
			send.append('name_pinyin',$scope.mainData.name_pinyin)
			send.append('study_direction',$scope.mainData.study_direction)
			send.append('organization',$scope.mainData.organization),
            send.append('phone',$scope.mainData.phone),
            send.append('IDcard',$scope.mainData.IDcard),
            send.append('description',$scope.mainData.description),
            send.append('exhibit_log',$scope.mainData.exhibit_log),
            send.append('collect_record',$scope.mainData.collect_record)

			$http({
				method:'POST',
				url:IPprefix+'update/artist/'+$stateParams.artistID,
				data: send,
				headers: {'Content-Type':undefined},
				transformRequest: angular.identity 
			}).then(function(res){
					// console.log(res)
				if(res.status===200){
					$state.go('tabs.artistsFiles/list')
				}
			})
		}
	}else{
		$scope.headFlag=true;
		// 新建艺术家信息，保存并下一步
		$scope.save=function(){
			var send = new FormData();
			if($scope.headerPic!=undefined){
	        	send.append('head', $scope.headerPic); 
		    }
			send.append('name',$scope.mainData.name)
			send.append('name_pinyin',$scope.mainData.name_pinyin)
			send.append('study_direction',$scope.mainData.study_direction)
			send.append('organization',$scope.mainData.organization),
            send.append('phone',$scope.mainData.phone),
            send.append('IDcard',$scope.mainData.IDcard),
            send.append('description',$scope.mainData.description),
            send.append('exhibit_log',$scope.mainData.exhibit_log),
            send.append('collect_record',$scope.mainData.collect_record)

			$http({
				method:'POST',
				url:IPprefix+'add/artist/',
				data: send,
				headers: {'Content-Type':undefined},
				transformRequest: angular.identity 
			}).then(function(res){
					// console.log(res)
				if(res.data.code==0){
					$location.path('tabs/artistsFiles/copyright/'+res.data.artist_id+'NaN')
				}
			})
		}
	}

	
}])
