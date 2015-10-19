/// <reference path='../_all.ts' />

module pumpkinWeb {

    interface IIssuesScope extends ng.IScope {
        issues: Issue[]
    }

    interface Issue {

    }

    export class IssuesOverviewController {

        public static $injector = [
            "$scope", "$http"
        ];

        constructor(
            private $scope: IIssuesScope,
            private $http: ng.IHttpService
        ){
            $scope.issues = [];
            $http.get("/api/issues").success(function(data: any){
                $scope.issues = data.issues;
            });
        }
    }
}
