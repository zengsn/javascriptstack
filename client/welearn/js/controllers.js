angular.module('starter.controllers', ['ngCookies'])

.controller('ActivitiesCtrl', function($scope, $ionicModal, $http, $cookies, Login, Signin, Signup, Chats) {
  // check login 
  Login.get({}, {}, function success(login) {
    if (login.username) { // already login
      // show the home view
      $scope.user = login;
    } else { // not login yet
      //var error = login.error;
      // firstly try to login with credits in cookie
      console.dir($cookies);
      var username = $cookies.username;
      var password = $cookies.password;
      if (username && password 
        && username != "undefined"
        && password != "undefined") {
        console.dir('username: ' + username);
        Signin.signin({}, {
          username: username,
          password: password
        }, function success(response) {
          console.dir(response);
          if (response.user) {
            // do nothing
            $scope.user = user;
          }
        }, function error(errorRes) {
          $scope.showAuthModal();
        });
      } else { // then show the login view        
        $scope.showAuthModal();
      }
    }
  }, function error(errorRes) {
    //
  });
  // auth modal
  $scope.showAuthModal = function() {
    $ionicModal.fromTemplateUrl('templates/modal-auth.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  };
  // signin and singup
  $scope.postData = {};
  $scope.signin = function(username, password) {
    if (!username || !password) {
      alert('帐号密码未填写！');
      return;
    }
    Signin.signin({}, {
      username: username,
      password: password
    }, function success(response) {
      console.dir(response);
      $cookies.username = username;
      $cookies.password = password;
      $scope.modal.hide();
    }, function error(errorRes) {
      $scope.showAuthModal();
    });
  };
  $scope.signup = function() {
    console.dir($scope.postData);
    Signup.signup({}, 
      $scope.postData, 
      function success(response) {
        console.dir(response);
        $cookies.username = $scope.postData.username;
        $cookies.password = $scope.postData.password;
        $scope.modal.hide();
      }, 
      function error(errorRes) {
        $scope.showAuthModal();
      }
    );
  };
  // search modal
  $ionicModal.fromTemplateUrl('templates/modal-search.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
$scope.chat = Chats.get($stateParams.chatId);
})

.controller('CoursesCtrl', function($scope, $ionicModal) {
  $scope.isTeacher = true;
  $scope.isStudent = false;
  $scope.course = {};
  $ionicModal.fromTemplateUrl('templates/modal-add.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  // 保存
  $scope.save = function() {
    alert($scope.course.name);
  };
})

.controller('SettingsCtrl', function($scope, $ionicPopup, $location, $cookies, Login, Signout) {
  $scope.isTeacher = true;
  $scope.isStudent = false;
  // 判断是否登录
  Login.get({}, {}, function success(response) {
    //console.dir(response);
    if (response && response.username) {
      $scope.user = response;
    }
  }, function error(errorRes) {
  });
  // 注销
  $scope.signout = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: '确认',
      template: '确认注销当前登录帐号吗？'
    });
    confirmPopup.then(function(res) {
      if(res) {
        Signout.signout({}, {}, function success(response) {
          $cookies.username = undefined;
          $cookies.password = undefined;
          $location.path('/tab/activities');
        }, function error(errorRes) {
          $location.path('/tab/activities');
        });
      } else {
        // do nothing
      }
    });
  };
})

.controller('SettingsAccountCtrl', function($scope) {
  $scope.type = 'student';

  $scope.save = function() {
    alert($scope.type + '-' + $scope.name);
  };
})

.controller('TodoCtrl', function($scope) {});
