/// <reference path='../_all.ts' />

module pumpkinWeb {
    export interface IRootScope extends ng.IScope {
        navbarCollapsed: boolean;
        session: pumpkinWeb.ISession;
        logout(): void;
        newMappack(): void;
    }
    export interface ISession {
        exists: boolean
    }
}
