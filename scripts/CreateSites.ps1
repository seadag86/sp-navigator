# Organization Name
$OrgName = Read-Host -Prompt "What is the name of your Office 365 organization? [sswms]"
if (!$OrgName) {
  $OrgName = "sswms"
  Write-Host "Oranization name set to 'sswms'"
}

# Tenant Site Collection URL
$SharePointMainurl = "https://$OrgName.sharepoint.com";

# Getting the information we need to create the sub site
$SiteOwner = Read-Host  -Prompt "Who is the owner of this site? [hello@mylesgregory.com]"
if (!$SiteOwner) {
  $SiteOwner = "hello@mylesgregory.com"
  Write-Host "Owner set to 'hello@mylesgregory.com'"
}
$SiteAlias = Read-Host -Prompt "Please enter the alias for the new SharePoint site."
if (!$SiteAlias) {
  Write-Error "Group name was left blank." -ErrorAction Stop
}
$SiteName = Read-Host -Prompt "Please enter the name of the new SharePoint site."
if (!$SiteName) {
  Write-Error "Site name was left blank." -ErrorAction Stop
}
$SiteUrl = "$SharePointMainurl/sites/$SiteAlias"

# Connects and Creates Context
Connect-PnPOnline -Url $SharePointMainurl
Write-Host "Connected with PnPOnline"

# writing new site collection
Write-Host "Creating "$SiteName
 
# Create the new "modern" team site
New-PnPSite -Type TeamSite -Title $SiteName -Alias $SiteAlias 
Write-Host "Your new SharePoint site $SiteName is created at this link: $SiteUrl"