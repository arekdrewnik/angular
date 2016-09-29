// (function () {
    'use strict';

    angular
        .module('promanager',  ['jcs-autoValidate', 'ui.router', 'ui.bootstrap'])
        .config(['$stateProvider', '$urlRouterProvider', appConfiguration])
        .run(function($rootScope){

            $rootScope.company = {
                'company_id' : '1',
                'company_name' : 'Nazwa firmy',
                'company_street' : 'Adres firmy',
                'company_email' : 'test@test.pl',
                'company_send_email' : 'test1@test.pl'
            };


            $rootScope.user = {
                'user_id' : '1',
                'user_name' : 'Arek',
                'user_surname' : 'DXX',
                'user_type' : '1'

            };

            $rootScope.buldings = [];

        })
        .controller('homeController', ['$scope', '$rootScope', 'getJson', homeController])
        .controller('settingsController', ['$scope', '$rootScope', 'getJson', '$stateParams', settingsController])
        .controller('settingsAddUser', ['$scope', '$rootScope', 'getJson', '$stateParams', '$state',  settingsAddUser])
        .controller('settingsEditUser', ['$scope', '$rootScope', 'getJson', '$stateParams',  settingsEditUser])


    ;


    function appConfiguration($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('/', {
            url: "/",
            templateUrl: 'app/home/HomeView.html', 
            controller: 'homeController'
        })
        .state('/login', {
              url: '/login',
              templateUrl: 'app/login/login.html',
              controller: 'loginController'
        })
        .state('/settings', {
                url: '/settings',
                templateUrl: 'app/settings/settings.html',
                controller: 'settingsController'
        })
        .state('/settings/user-add', {
                url: '/settings/user-add',
                templateUrl: 'app/settings/settings-user-add.html',
                controller: 'settingsAddUser'
        })
        .state('/settings/user', {
                url: '/settings/user/:id',
                templateUrl: 'app/settings/settings-user-edit.html',
                controller: 'settingsAddUser'
        })
        .state('/logout', {
                url: '/logout',
                templateUrl: 'app/settings/settings.html',
                controller: 'settingsController'
        })
    }


    function homeController($scope, $rootScope, getJson){

        $scope.companyInfo = [];
        $scope.company = 1;
        $scope.user = 1;

    }


    function settingsController($scope, $rootScope, getJson, $stateParams){

        $scope.company = {};
        $scope.users = {};
        $scope.cn = 1;
        $scope.activeTab = [true, false, false, false];


        if($rootScope.company){
            console.log($rootScope.company);
        }


        $scope.saveCompany = function(){

            getJson.updateElement('updateSettings',  $scope.cn, $scope.cn, $scope.company, function(data){

                $rootScope.company = $scope.company;

            }, function(data, status){
                console.log('status' +  status + ' data ' + data)
            });

        };

        $scope.clickTab = function(tab){
            var activeTab = tab || 0;
            $scope.activeTab.length = 0;
            for(var i =0; i<4; i++){
                $scope.activeTab[i] = false;
            }

            $scope.activeTab[activeTab] = true;

            console.log(activeTab)

            if(activeTab == 4){
                getUsers();
            }

        };

        $scope.clickTab();


        function getUsers(){

            getJson.getElement('getUsers', $scope.cn, $scope.cn, function(data){
                $scope.users = data;
            }, function(data, status){
                console.log('status' +  status + ' data ' + data)
            });

        }

        function getSettings(){

            getJson.getElement('settings', $scope.cn, $scope.cn, function(data){
                $scope.company = data[0];
            }, function(data, status){
                console.log('status' +  status + ' data ' + data)
            });

        }

        getSettings();

    }


    function settingsAddUser ($scope, $rootScope, getJson, $stateParams, $state){

        $scope.user = {};
        $scope.showButton = true;

        var activeUser = $stateParams.id;

        if($stateParams.id) {
            getDataUser();
        }


        function getDataUser(){

                getJson.getElement('getUser', activeUser, activeUser, function (data) {

                    $scope.user = data[0];
                    $scope.showButton = false;


                    // $state.go('/settings', {});

                }, function (data, status) {

                    console.log('status' + status + ' data ' + data)

                });

        }


        $scope.addEditUser = function(){

            if($scope.showButton){

                getJson.addElement('addUser', activeUser || $rootScope.company.company_id, $rootScope.company.company_id, $scope.user, function (data) {

                    $state.go('/settings/user', {id : data.last});

                }, function (data, status) {

                    console.log('status' + status + ' data ' + data)

                });


            }else{

                getJson.updateElement('updateUser', $rootScope.company.company_id, activeUser, $scope.user, function (data) {

                    


                }, function (data, status) {

                    console.log('status' + status + ' data ' + data)

                });

            }



        }


    }