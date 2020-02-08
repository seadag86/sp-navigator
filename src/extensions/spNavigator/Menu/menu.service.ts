import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { sp } from "@pnp/sp";
import { ISearchQuery, SearchResults } from "@pnp/sp/search";
import { IWeb } from "@pnp/sp/webs";
import { IMenuItem } from "./Menu";
import "@pnp/sp/webs";
import "@pnp/sp/sites";
import "@pnp/sp/search";

export interface ISampleService {
  getLists(): Promise<any[]>;
}

export default class MenuService {
  constructor(context: ApplicationCustomizerContext) {
    sp.setup(context);
  }

  /**
   * Get all site collections, sites and sub sites from api
   * Transform response to contain only IMenuItem props
   * Loop through site collections and add any sites as children
   */
  public async buildMenuItems(): Promise<IMenuItem[]> {
    const siteCollections = await this.getAllSiteCollections();
    const subSites = await this.getAllSubSites();

    console.log("site collectiions", siteCollections);
    console.log("sub sites", subSites);

    // If subsite is child of site collection add to children prop
    return siteCollections.map(webSite => {
      return {
        ...webSite,
        children: subSites.filter(
          ss => ss.url.toLowerCase().indexOf(webSite.url.toLowerCase()) != -1
        )
      };
    });
  }

  private async getAllSiteCollections(): Promise<IMenuItem[]> {
    const results = await sp.search(<ISearchQuery>{
      Querytext: "contentclass:STS_Site",
      SelectProperties: ["Title", "Path", "ParentLink"],
      RowLimit: 500,
      TrimDuplicates: false
    });

    return this.mapWebSites(results);
  }

  private async getAllSubSites(): Promise<IMenuItem[]> {
    const results = await sp.search(<ISearchQuery>{
      Querytext: "contentclass:STS_Web",
      RowLimit: 500,
      TrimDuplicates: false
    });

    return this.mapWebSites(results);
  }

  private mapWebSites(results: SearchResults): IMenuItem[] {
    return (
      results.PrimarySearchResults
        // Return only the props needed for IMenuItem
        .map((result: { Title: string; Path: string; ParentLink: string }) => {
          return {
            title: result.Title,
            url: result.Path,
            parentUrl: result.ParentLink,
            weight: result.Path ? result.Path.split("/").length : 0
          };
        })
        // Filter out any not a standard site
        .filter(
          result =>
            result.url.indexOf("sharepoint.com/sites/") !== -1 &&
            result.url.indexOf("sharepoint.com/sites/apps") === -1
        )
        // Sort by number of parts in url
        .sort((a, b) => {
          if (a.weight > b.weight) {
            return 1;
          } else if (a.weight < b.weight) {
            return -1;
          } else {
            return 0;
          }
        })
        // If item is child of another add to children prop
        .reduce((acc: IMenuItem[], curVal) => {
          let addedChild = false;
          const newAcc = acc.map(itm => {
            if (itm.url == curVal.parentUrl) {
              itm.children =
                itm.children && itm.children.length
                  ? [...itm.children, curVal]
                  : (itm.children = [curVal]);

              addedChild = true;
            }

            return itm;
          });

          if (addedChild) {
            return newAcc;
          }

          return [...acc, curVal];
        }, [])
    );
  }
}
