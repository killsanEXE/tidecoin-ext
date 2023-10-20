export interface ConnectedSite {
    origin: string;
    icon: string;
    name: string;
    e?: number;
    order?: number;
    isConnected: boolean;
}


class PermissionService {
    private _sites: ConnectedSite[] = [];

    constructor() {
        this._sites = [];
    }

    get connectedSites() {
        return this._sites.filter(f => f.isConnected);
    }

    get allSites() {
        return this._sites;
    }

    siteIsConnected(origin: string): boolean {
        const site = this._sites.find(f => f.origin === origin);
        return site ? site.isConnected : false;
    }

    addConnectedSite(origin: string, name: string, icon: string) {
        const alreadyConnectedSite = this._sites.find(f => f.origin === origin);
        if (!alreadyConnectedSite) this._sites.push({
            origin,
            name,
            icon,
            isConnected: true
        })
        else this._sites[this._sites.indexOf(alreadyConnectedSite)].isConnected = true;
    }

    disconnectSites() {
        for (const site of this._sites) {
            site.isConnected = false;
        }
    }
}

export default new PermissionService();
