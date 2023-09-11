"viewsContainers": {
"activitybar": [
{
"id": "odooDebugContainer",
"title": "Odoo Debug",
"icon": "resources/odoo.svg"
}
]
},
"views": {
"odooDebugContainer": [
{
"id": "odoo-debug.odooBoardView",
"name": "Odoo Board",
"type": "webview"
}
]
},
"menus": {
"view/title": [
{
"command": "odoo-debug.debugServer",
"when": "view == odoo-debug.odooBoardView",
"group": "navigation",
"icon": "${start}"
}
]
},
