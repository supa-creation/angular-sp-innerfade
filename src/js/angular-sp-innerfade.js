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

    module.directive('spInnerfade', [
        '$timeout', '$window',
        function($timeout, $window)
        {
            return {
                restrict: 'AC',
                link: function ($scope, $element)
                {
                    $scope.items = [];
                    $scope.currentIndex = 0;

                    $scope.append = function(item) {
                        $scope.items.push(item);
                    };

                    $scope.next = function ()
                    {
                        if (this.currentIndex < (this.items.length - 1)) {
                            this.currentIndex++;
                        } else {
                            this.currentIndex = 0;
                        }
                    };

                    $scope.layout = function ()
                    {
                        if (this.items.length >= this.currentIndex + 1) {
                            $element.css({
                                height: this.items[this.currentIndex].offsetHeight + 'px'
                            });
                        }
                    };

                    $scope.play = function ()
                    {
                        $timeout(function () {
                            $scope.next();
                            $scope.play();
                        }, 5000);
                    };

                    $scope.$watch('currentIndex', function () {
                        $scope.layout();
                    });

                    angular.element($window).bind('resize', function () {
                        $scope.layout();
                    });

                    $scope.play();
                }
            };
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
                link: function(scope, element)
                {
                    $timeout(function() {
                        var parentScope = element.parent('*[sp-innerfade]:first, .sp-innerfade:first').scope();
                        parentScope.append(element[0]);

                        scope.index = Array.prototype.indexOf.call(scope.items, element[0]);

                        element.find('img').bind('load', function() {
                            scope.layout();
                        });
                    });
                }
            };
        }
    ]);

    return module;
}));