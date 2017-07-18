/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-07-05 16:52:53
 * @version $Id$
 */
index
// ajax
.factory('postJson', function($q,$http,IPprefix){
    return {
        do: function(url,obj){
            var dedered = $q.defer();
            $http.post(
                IPprefix+url,
                $.param(obj),
                {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
            ).then(function(result){
                dedered.resolve(result);
            }).catch(function (result, status) {
                dedered.reject(status);
            });
            return dedered.promise;
        }
    }
})
.factory('getMsg', function($q,$http,IPprefix){
    return {
        do: function(url){
            var dedered = $q.defer();
            $http.get(
                IPprefix+url
            ).then(function(result){
                dedered.resolve(result);
            }).catch(function (result, status) {
                dedered.reject(status);
            });
            return dedered.promise;
        }
    }
})
.factory('showModal', function(){
    return function(option,title,$scope){
        $scope.flag=false;
        $scope.showMsg=title
        if(option=='alert'){
            // 设置alert弹框
            $scope.flag=true;
            $scope.cancel='我知道了'
        }else if(option=='confirm'){
            // 设置confim弹框
            $scope.cancel='取消'
            $scope.conf='确认'
        }
        $('#myModal').modal('show')
    }
})