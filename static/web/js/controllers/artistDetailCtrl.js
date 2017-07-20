/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-07-04 11:30:36
 * @version $Id$
 */
index.controller('artistsDetailCtrl', ['$scope','$stateParams','getMsg','userInfo','showModal', function($scope,$stateParams,getMsg,userInfo,showModal){
	$scope.user=userInfo.data

	// 艺术家信息数据获取
	getMsg.do('artist/all/info/'+$stateParams.artistID).then(function(res){
		if(res.data.code==0){
			// console.log(res)
			$scope.mainData=res.data.artist_data;
			$scope.mainData2=res.data.authorize_data;

			// 计算对账和核算日期
			if($scope.mainData2.authorize_time){
				// 授权时间
				var accountTime=new Date($scope.mainData2.authorize_time.split(' ')[0])
				// 有效时间
				let useyear=accountTime.getFullYear()+$scope.mainData2.authorize_period;
				let usemonth=accountTime.getMonth()
				let usedate=accountTime.getDate()
				var usefulTime=new Date(useyear,usemonth,usedate)
				// 当前时间
				var nowDate = new Date()
				// 对账时间
				var monthDate = new Date(nowDate.getFullYear(),nowDate.getMonth()+1,1,-1)
				// 核算时间
				var yearDate=accountTime
				while(yearDate<nowDate){
					yearDate=new Date(yearDate.getFullYear(),yearDate.getMonth()+7,1,-1)
				}
				if(nowDate<usefulTime){
					$scope.monthDate = monthDate.getFullYear()+'年'+(monthDate.getMonth()+1)+'月'+monthDate.getDate()+'日';
					$scope.yearDate = yearDate.getFullYear()+'年'+(yearDate.getMonth()+1)+'月'+yearDate.getDate()+'日';
				}else{
					$scope.monthDate = '已逾期'
					$scope.yearDate = '已逾期'
				}
			}
		}else{
			showModal('alert',res.message,$scope)
		}
	})

	
}])
