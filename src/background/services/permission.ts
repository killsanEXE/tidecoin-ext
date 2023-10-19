import { CHAINS_ENUM, INTERNAL_REQUEST_ORIGIN } from '@/shared/constant';
import { max } from 'lodash';

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
        return this._sites.find(f => f.origin === origin).isConnected ?? false;
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
}

export default new PermissionService();
