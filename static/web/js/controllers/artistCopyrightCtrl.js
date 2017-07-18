/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-07-04 11:20:43
 * @version $Id$
 */
index.controller('artistsCopyrightCtrl', ['$scope','$stateParams','getMsg','$http','IPprefix','$state','postJson','showModal', function($scope,$stateParams,getMsg,$http,IPprefix,$state,postJson,showModal){
	// 声明复选数组
	$scope.selected=[];	// 选择多项

	// 控制txt
	$scope.ctrlTxt = function(flag,i){
		return flag==true? $scope['txt'+i]=true:$scope['txt'+i]=false;
	}

	// 复选框绑定
    $scope.isChecked = function(id){  
        return $scope.selected.indexOf(id) >= 0
    }
    // 复选框事件
    $scope.updateSelection = function($event,id){  
        let checkbox = $event.target
        let checked = checkbox.checked
        if(checked){  
            $scope.selected.push(id)
        }else{  
            let idx = $scope.selected.indexOf(id)
            $scope.selected.splice(idx,1)
        }
    }

	// 跳过按钮
	$scope.skip = function(){
		$state.go('tabs.artistsFiles/list')
	}

	// 取消按钮
	$scope.no=function(){
		$('#myModal').modal('hide')
	}

	// 填入授权品类封装
	function insertData(target,i){
		if($scope.mainData[target]){
			$scope.selected.push(target)
		}else{
			return;
		}
		$scope[target]=$scope.mainData[target]
		if($scope.mainData[target]>=0){
			if($scope[target]!=5 && $scope[target]!=10){
				$scope['txt'+i]=true;
				$scope[target+'Txt']=Number($scope.mainData[target]);
				$scope[target]='other';
			}
		}
	}
	
	// 日期数字处理
	function fixNum(num){
		return num>9 ? num : '0'+num;
	}
	// 授权品类提交数据处理
	function fixMsg(target,params){
		if($scope.isChecked(target)){
			if($scope[target]==='other'){
				params[target]=$scope[target+'Txt']+''
			}else{
				params[target]=$scope[target]
			}
		}
	}

	// 准备提交数据
	function prepareDate(){
		let d = new Date($scope.date)
		let authorize_time=d.getFullYear() +'-'+ fixNum(1+d.getMonth()) +'-'+ fixNum(d.getDate());
		let params = {
			"no_limit":"",
			"limit":"",
			"body_derive":"",
			"number_derive":"",
			"business_authorize":""
		}
		params.is_public=$scope.publicCopyright
		params.authorize_area=$scope.accreditArea
		params.is_unique=$scope.accreditOnly
		params.is_foreign=$scope.outAccredit
		params.is_delegation=$scope.transAccredit
		params.def_price=$scope.dealPrice
		params.authorize_time=authorize_time
		params.authorize_period=$scope.accredit==='other' ? $scope.accreditDate : $scope.accredit ;
		fixMsg('no_limit',params)
		fixMsg('limit',params)
		fixMsg('body_derive',params)
		fixMsg('number_derive',params)
		fixMsg('business_authorize',params)
		return params;
	}

	// 判断ID类型，编辑或新建
	if(isFinite($stateParams.artistID)){
		$scope.id=sessionStorage.getItem('id')
		sessionStorage.removeItem('id')
		$scope.name=sessionStorage.getItem('name')
		sessionStorage.removeItem('name')
		// 获取授权卡信息
		getMsg.do('authorize/detail/'+$stateParams.artistID).then(function(res){
			if(res.status===200){
				// console.log(res)
				$scope.mainData=res.data.data

				// 数据填入
				$scope.headIMG=$scope.mainData.head
				$scope.publicCopyright=$scope.mainData.is_public
				$scope.accreditArea=$scope.mainData.authorize_area
				$scope.accreditOnly=$scope.mainData.is_unique
				$scope.outAccredit=$scope.mainData.is_foreign
				$scope.transAccredit=$scope.mainData.is_delegation
				$scope.dealPrice=$scope.mainData.def_price
				// 授权时间
				$scope.date=new Date($scope.mainData.authorize_time)	
				// 授权期
				$scope.accredit=$scope.mainData.authorize_period
				if($scope.accredit!=3 && $scope.accredit!=5 && $scope.accredit!=10){
					$scope.txt1=true;
					$scope.accreditDate=$scope.mainData.authorize_period;
					$scope.accredit='other';
				}

				// 授权品类分成
				insertData('no_limit',2)
				insertData('limit',3)
				insertData('body_derive',4)
				insertData('number_derive',5)
				insertData('business_authorize',6)
			}
		})

		// 提交按钮,编辑授权卡
		$scope.sub = function(){
			if(!$scope.accreditArea>0){
				showModal('alert','请选择授权范围！',$scope)
				return
			}
			if($scope.selected.length<=0){
				showModal('alert','请选择正确的授权品类及分成！',$scope)
				return
			}
			let params=prepareDate();
			params.artist=$scope.mainData.artist
			postJson.do('update/authorize/'+$stateParams.artistID,params).then(function(res){
					console.log(res)
				if(res.data.code==0){
					$state.go('tabs.artistsFiles/list')
				}
			})
		}
	}else{
		$scope.headIMG=sessionStorage.getItem('img')
		sessionStorage.removeItem('img')
		$scope.id=sessionStorage.getItem('id')
		sessionStorage.removeItem('id')
		$scope.name=sessionStorage.getItem('name')
		sessionStorage.removeItem('name')
		// 提交按钮，新建授权卡
		$scope.sub = function(){
			if(!$scope.accreditArea>0){
				showModal('alert','请选择授权范围！',$scope)
				return
			}
			if($scope.selected.length<=0){
				showModal('alert','请选择正确的授权品类及分成！',$scope)
				return
			}
			let params=prepareDate();
			params.artist=parseInt($stateParams.artistID)
			postJson.do('add/authorize/',params).then(function(res){
					console.log(res)	
				if(res.data.code==0){
					$state.go('tabs.artistsFiles/list')
				}
			})
		}
	}
}])
