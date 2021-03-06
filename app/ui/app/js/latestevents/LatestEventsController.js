/**
 * Copyright (c) 2015 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
    "use strict";

    App.controller('LatestEventsController', ['$scope', 'State', 'EventsResource', 'ngTableParams',
        function ($scope, State, EventsResource, ngTableParams) {
            var state = new State().setPending();
            $scope.state = state;

            $scope.collectData = function($defer, params) {
                $scope.state.setPending();

                EventsResource.getPage((params.page()-1)*params.count(), params.count())
                .then(function(response){
                    $scope.events = response.events;

                    params.total(response.total);
                    $defer.resolve($scope.events);
                    $scope.state.setLoaded();
                });
            };

            /*jshint newcap: false*/
            $scope.tableParams = new ngTableParams({
                page: 1,
                count: 10,
            }, {
                getData: $scope.collectData
            });
        }]);
}());
