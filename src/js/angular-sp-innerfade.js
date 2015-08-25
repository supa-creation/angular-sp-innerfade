(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        module.exports = factory(require('angular'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['angular'], factory);
    } else {
        // Global Variables
        factory(root.angular);
    }
}(this, function (angular) {
    'use strict';

    var module = angular.module('spInnerfade', []);

    module.controller('spInnerfade', [
        '$scope', '$element', '$timeout', '$window',
        function($scope, $element, $timeout, $window)
        {
            $scope.items = $element[0].querySelectorAll('.sp-innerfade-item');

            $scope.next = function(){
                if(this.currentIndex < (this.items.length - 1)){
                    this.currentIndex++;
                }else{
                    this.currentIndex = 0;
                }
            };

            $scope.updateHeight = function(){
                $element.css({height:$scope.items[this.currentIndex].offsetHeight+'px'});
            };

            $scope.$watch('currentIndex', function(){
                $scope.updateHeight();
            });

            angular.element($window).bind('resize', function(){
                $scope.updateHeight();
            });

            $scope.play = function() {
                $timeout(function() {
                    $scope.next();
                    $scope.play();
                }, 5000);
            };

            $scope.currentIndex = 0;
            $scope.play();
        }
    ]);

    module.directive('spInnerfadeItem', [
        '$window', '$timeout',
        function($window, $timeout)
        {
            return {
                restrict: 'AC',
                replace: !0,
                transclude:!0,
                scope: true,
                template: '<div ng-show="currentIndex == index" ng-transclude></div>',
                link: function($scope, $element)
                {
                    $timeout(function() {
                        $scope.index = Array.prototype.indexOf.call($scope.items, $element[0]);

                        $element.find('img').bind('load', function() {
                            $scope.updateHeight();
                        });
                    });
                }
            };
        }
    ]);

    return module;
}));