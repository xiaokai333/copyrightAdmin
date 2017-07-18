
index.controller('tabCtrl',['$scope','userInfo','IPprefix',
    function($scope,userInfo,IPprefix){
        $scope.userInfo=userInfo;
        //安全退出
        $scope.quit=function(){
            if(confirm("确认退出版权管理平台?")){
                sessionStorage.clear();
                window.location.href="http://dev.artally.com.cn/copyrightAdmin";
            }else{
                return;
            }
        }
    }
])