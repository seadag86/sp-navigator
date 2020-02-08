# Organization Name
$OrgName = Read-Host -Prompt "What is the name of your Office 365 organization? [sswms]"
if (!$OrgName) {
  $OrgName = "sswms"
  Write-Host "Oranization name set to 'sswms'"
}

# Web Collection URL
$SharePointMainurl = "https://$OrgName.sharepoint.com";

# Getting the information we need to create the sub site
$WebPwmer = Read-Host  -Prompt "Who is the owner of this site? [hello@mylesgregory.com]"
if (!$WebPwmer) {
  $WebPwmer = "hello@mylesgregory.com"
  Write-Host "Owner set to 'hello@mylesgregory.com'"
}
$WebPath = Read-Host -Prompt "Please enter path where new SharePoint Sub Site will be"
if (!$WebPath) {
  Write-Error "Web path was left blank." -ErrorAction Stop
}
$WebAlias = Read-Host -Prompt "Please enter alias for new SharePoint Sub Site"
if (!$WebAlias) {
  Write-Error "Web alias was left blank." -ErrorAction Stop
}
$WebName = Read-Host -Prompt "Please enter name of the new SharePoint Sub Site"
if (!$WebName) {
  Write-Error "Web name was left blank." -ErrorAction Stop
}
$WebUrl = "$SharePointMainurl/sites/$WebPath"

# ConnecTs and Creates Context
Connect-PnPOnline -Url $WebUrl
Write-Host "Connected with PnPOnline"

# Writing  new web
Write-Host "Creating "$WebName
 
# Create the new "modern" team site
New-PnPWeb -Title $WebName -Url $WebAlias -Template "STS#3" 
Write-Host "Your new SharePoint sub site $WebName is created at this link: $WebUrl/$WebAlias"