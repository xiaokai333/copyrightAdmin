/**
 * 
 * @date    2017-07-04 10:59:25
 * @version $Id$
 http://172.16.7.235:8000/web/admin/artists/添加：'head', 'phone', 'artist_number', 'name', 'name_pinyin', 'description','study_direction', 'organization', 'exhibit_log', 'collect_record
 */
index.controller('artistsFilesListCtrl', ['$scope','postJson','getMsg','$state','showModal','userInfo','$http','IPprefix', function($scope,postJson,getMsg,$state,showModal,userInfo,$http,IPprefix){
	// 初始化数据
	$scope.selected=[];	// 选择多项
	$scope.mainData=[];
	$scope.user=userInfo.data
	// 列表数据获取
	getMsg.do('list/artist/').then(function(res){
		if(res.data.code==0){
			// console.log(res)
			$scope.mainData=res.data.data
		}else{
			showModal('alert',res.message,$scope)
		}
	})
    
	// 搜索框功能
    $scope.search = function(searchText){
        if(searchText){
            var info={
                search:searchText
            }
            $http(
                {method:'GET',url:IPprefix+"list/artist/",params:info}
            ).then(function(resp){
                if(resp.data.code === 0){
                    $scope.mainData=resp.data.data;
                }else{
					showModal('alert',res.message,$scope)
				}
            })
        }
    };

    // 复选框绑定
    $scope.isChecked = function(id){  
        return $scope.selected.indexOf(id) >= 0
    }
    // 复选框事件
    $scope.updateSelection = function($event,id){  
        var checkbox = $event.target
        var checked = checkbox.checked
        if(checked){  
            $scope.selected.push(id)
        }else{  
            var idx = $scope.selected.indexOf(id)
            $scope.selected.splice(idx,1)
        }
    }
    // 全选按钮绑定
    $scope.isCheckedAll = function(){  
    	return ($scope.selected.length==$scope.mainData.length)
    }
    // 全选按钮
    $scope.selectAll=function($event){
    	var checkbox = $event.target
        var checked = checkbox.checked
        if(checked){  
        	$scope.selected=[];
            angular.forEach($scope.mainData,function(item,index){
            	$scope.selected.push(item.id)
            }); 
        }else{  
            $scope.selected=[];
        }
    }

    $scope.addS=function(item){
    	sessionStorage.setItem('img', item.head)
    	sessionStorage.setItem('id', item.artist_number	)
    	sessionStorage.setItem('name', item.name)
    }

	// 删除和打印按钮
	$scope.button=function(option){
		// 设置alert弹框
		if(!$scope.selected.join()){
			let title=null
			if(option=='del'){
				title='请选择要删除的艺术家档案！'
			}else if(option=='print'){
				title='请选择要打印的艺术家档案！'
			}
			showModal('alert',title,$scope)
			return;
		}

		// 设置confim弹框
		var tit=null
		if(option=='del'){
			tit='删除艺术家信息会造成对应艺术家的艺术品版权信息失效，确认删除？'
			// 确认删除按钮
			$scope.yes=function(){
				postJson.do('delete/artist/',{"artist_ids":$scope.selected.join()}).then(function(res){
					// console.log(res)
					if(res.data.code==0){
						$scope.mainData=res.data.data
						$('#myModal').modal('hide')
						$scope.selected=[];	// 选择多项
					}else{
						$('#myModal').modal('hide')
						showModal('alert',res.message,$scope)
					}
				})
			}
		}else if(option=='print'){
			tit='打印艺术家信息会导出Excel表格，确认打印？'
			// 确认打印按钮
			$scope.yes=function(){
				postJson.do('export/excel',{"category":"artist","ids":$scope.selected.join()}).then(function(res){
					// console.log(res)
					if(res.data.code===0){
						$('#myModal').modal('hide')
						$scope.selected=[];	// 选择多项
						window.open(res.data.path)
					}else{
						$('#myModal').modal('hide')
						showModal('alert',res.message,$scope)
					}
				})
			}
		}	
		showModal('confirm',tit,$scope)
	}
	// 取消按钮
	$scope.no=function(){
		$('#myModal').modal('hide')
	}
}])
