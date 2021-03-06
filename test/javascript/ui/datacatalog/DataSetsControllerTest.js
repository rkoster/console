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
describe("Unit: DataSetsController", function() {

    beforeEach(module('app'));

    var controller,
        scope,
        rootScope,
        state,
        dataSetResource,
        q;

    beforeEach(inject(function($injector, $rootScope, State, $q){
        rootScope = $rootScope;
        q = $q;

        scope = rootScope.$new();

        rootScope.search = '';

        dataSetResource = {
            getByQuery: function(){
                return q.defer().promise;
            },
            withErrorMessage: function() {
                return this;
            }
        };

        controller = $injector.get('$controller')('DataSetsController', {
            $scope: scope,
            DataSetResource: dataSetResource
        });
        state = scope.state;
    }));

    it('should not be null', function(){
        expect(controller).not.to.be.null;
    });

    it('search, set state pending', inject(function(){
        scope.search();

        expect(state.value).to.be.equal(state.values.PENDING);
    }));

    it('search, empty filters, send empty request', inject(function(){
        var query = null;
        dataSetResource.getByQuery = function(_query) {
            query = _query.query;
            return q.defer().promise;
        };

        scope.search();

        expect(query.query).to.be.empty;
        expect(query.filters).to.be.empty;
    }));

    it('onCategoryChange, send request with category', inject(function(){
        var query = null;
        dataSetResource.getByQuery = function(_query) {
            query = _query;
            return q.defer().promise;
        };

        scope.onCategoryChange('banana');

        expect(query.query).to.be.empty;
        expect(query.filters.length).to.be.equal(1);
        expect(query.filters[0].category).to.be.deep.equal(['banana']);
    }));

    it('onCategoryChange, send request with category', inject(function(){
        var query = null;
        dataSetResource.getByQuery = function(_query) {
            query = _query;
            return q.defer().promise;
        };

        scope.onCategoryChange('banana');

        expect(query.query).to.be.empty;
        expect(query.filters.length).to.be.equal(1);
        expect(query.filters[0].category).to.be.deep.equal(['banana']);
    }));

    it('format changed, send request with format', inject(function(){
        var query = null;
        dataSetResource.getByQuery = function(_query) {
            query = _query;
            return q.defer().promise;
        };

        scope.$apply();
        scope.format.value = 'banana';
        scope.$apply();

        expect(query.query).to.be.empty;
        expect(query.filters.length).to.be.equal(1);
        expect(query.filters[0].format).to.be.deep.equal(['banana']);
    }));

    it('created from, send request with created from', inject(function(){
        var query = null;
        dataSetResource.getByQuery = function(_query) {
            query = _query;
            return q.defer().promise;
        };

        scope.$apply();
        scope.created.from = 'banana';
        scope.$apply();

        expect(query.query).to.be.empty;
        expect(query.filters.length).to.be.equal(1);
        expect(query.filters[0].creationTime).to.be.deep.equal(['banana', -1]);
    }));

    it('created to, send request with created to', inject(function(){
        var query = null;
        dataSetResource.getByQuery = function(_query) {
            query = _query;
            return q.defer().promise;
        };

        scope.$apply();
        scope.created.to = 'banana';
        scope.$apply();

        expect(query.query).to.be.empty;
        expect(query.filters.length).to.be.equal(1);
        expect(query.filters[0].creationTime).to.be.deep.equal([-1, 'banana']);
    }));

    it('search changed, send request with query', inject(function(){
        var query = null;
        dataSetResource.getByQuery = function(_query) {
            query = _query;
            return q.defer().promise;
        };

        rootScope.$broadcast('searchChanged', 'banana');

        expect(query.query).to.be.equal('banana');
        expect(query.filters).to.be.empty;
    }));

    it('all filters set, send request with all filters', inject(function(){
        var query = null;
        dataSetResource.getByQuery = function(_query) {
            query = _query;
            return q.defer().promise;
        };

        scope.$apply();
        scope.created.from = 'mockfrom';
        scope.created.to = 'mockto';
        scope.format.value = 'mockformat';
        scope.$apply();
        rootScope.$broadcast('searchChanged', 'mockquery');

        expect(query.query).to.be.equal('mockquery');
        expect(query.filters.length).to.be.equal(2);

        var createdFilter = _.find(query.filters, function(f){
            return f.creationTime;
        });;
        expect(findFilter(query.filters, 'creationTime')).to.be.deep.equal(['mockfrom', 'mockto']);

        expect(findFilter(query.filters, 'format')).to.be.deep.equal(['mockformat']);
    }));

    function findFilter(filters, name){
        var filter = _.find(filters, function(f){
            return f[name];
        });
        return filter && filter[name];
    }
});
