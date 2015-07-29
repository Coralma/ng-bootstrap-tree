angular.module('ng-bootstrap-tree', [])
    .directive('treeView', function() {
        return  {
            restrict: 'E',
            replace: true,
            scope: {
                options: '=',
                onSelect: '&',
                defaultSelect: '@',
                treeControl: '=',
                fieldClass: '@'
            },
            link: function(scope, element, attrs) {
                scope.treeData = scope.options.treeData;
                scope.labelField = scope.options.labelField;
                scope.nodeChildren = scope.options.nodeChildren;
/*
                if (attrs.iconExpand == null) {
                    attrs.iconExpand = 'icon-plus glyphicon glyphicon-triangle-right fa fa-plus';
                }
                if (attrs.iconCollapse == null) {
                    attrs.iconCollapse = 'icon-minus glyphicon glyphicon-triangle-bottom fa fa-minus';
                }
                if (attrs.iconLeaf == null) {
                    attrs.iconLeaf = 'icon-file fa fa-file';
                }*/
                scope.$watch('options.treeData', function(data) {
                    var rows = [],level=1;
                    for_each_node(data, rows, level);
                    scope.treeRows = rows;
                    console.log("tree rows : " + JSON.stringify(scope.treeRows, null, '\t'));
                });

                for_each_node = function(data, rows, level) {
                    var childrenLen = data.length, i= 0, item=data[0];
                    while(i < childrenLen) {
                        var row = {};
                        item = data[i++];
                        row.uid = "" + Math.random();
                        row.label = item[scope.labelField];
                        row.level = level;
                        row.visible = true;
                        rows.push(row);
                        /*console.log("Label: " + row.label);*/
                        var children = item[scope.nodeChildren];
                        if(!angular.isUndefined(children)) {
                            console.log("Children: " + JSON.stringify(children));
                            row.children = children;
                            var subLevel = level + 1;
                            for_each_node(children,rows,subLevel);
                        }

                    }
                }

                scope.user_clicks_branch = function(row) {
                    if (row !== scope.selected_node) {
                        return select_branch(row);
                    }
                };
            },
            template:
                "<ul class=\"nav nav-list nav-pills nav-stacked abn-tree\">" +
                "   <li ng-repeat=\"row in treeRows | filter:{visible:true} \" ng-animate=\"'abn-tree-animate'\" ng-class=\"'level-' + {{ row.level }} + (row.selected ? ' active':'') + ' ' + row.classes.join(' ')\" class=\"abn-tree-row\">" +
                "       <a ng-click=\"user_clicks_branch(row)\" ng-dblclick='row.expanded = !row.expanded'>" +
                "           <i ng-class=\"row.tree_icon\" ng-click=\"row.expanded = !row.expanded\" class=\"indented tree-icon\"></i>" +
                "               <span class=\"indented tree-label\">{{ row.label }}</span>" +
                "       </a>"+
                "   </li>" +
                "</ul>"
        }
    });