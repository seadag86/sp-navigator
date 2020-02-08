#Region Input Variables

# Organization Name
$orgName = Read-Host "<name of your Office 365 organization, example: windfallcompany>"

# Tenant Site Collection URL
$tenantSiteURL = "https://$orgName-admin.sharepoint.com";

# Output Path
$outPath = Read-Host "<Enter output file path, example: D:\Libraries\Scripts> "

# Tenant admin user Credentials
$credential = Get-Credential

#create variables for output file
$date = Get-Date -format yyyy-MM-dd
$time = Get-Date -format HH-mm-ss
$outputfilename = "SCInventory" + $date + "_" + $time + ".csv"
$outputpath = $outPath + "\" + $outputfilename

#EndRegion


#Region Connect

# Connects and Creates Context
Connect-PnPOnline -Url $tenantSiteURL -Credentials $credential

#EndRegion


#Region Retrieve Site Collections
# Function to retrieve site collections from Office 365 tenant site specified
function RetrieveSiteCollections () {
    # Retrieves site collections on o365 site
    $sites = Get-PnPTenantSite -Detailed -IncludeOneDriveSites

    # Displays the site collections from tenant on the console
    Write-Host "There are " $sites.count " site collections present"

    # Loop through Sites
    foreach ($site in $sites) {
        $site | Select-Object Title, Url, Owner, Template, StorageUsage, SharingCapability, WebsCount, IsHubSite, HubSiteId, LastContentModifiedDate |
        Export-Csv $outputpath -NoTypeInformation -Append
    }
}

# Calls the Function
RetrieveSiteCollections # Retrieves site collections from Office 365 tenant site

# Display Site Collection Inventory complete
Write-Host "Site Collection Inventory Completed in $outputpath"

#EndRegion