/**
 * Dynamic Layout Injector for Hostel Management System Static Demo
 * Replaces PHP master.php and footer.php templates in static HTML.
 */

(function () {
    // 1. Session verification
    const session = getCurrentSession();
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
    
    if (!session && !isLoginPage) {
        // Redirect to login page if no active session
        const base = window.location.pathname.includes('/ui/') ? '../../' : './';
        window.location.href = base + 'index.html';
        return;
    }

    if (isLoginPage) {
        // If we are on login page, do not inject main layout
        return;
    }

    // Determine path depth (base prefix to root)
    const base = window.location.pathname.includes('/ui/') ? '../../' : './';
    const userRole = session ? session.userGroupId : 'UG001'; // UG001=Admin, UG003=Employee, UG004=Student

    // 2. Inject Stylesheets into <head>
    const stylesheets = [
        "dist/css/bootstrap.min.css",
        "dist/css/datepicker.css",
        "dist/css/metisMenu.min.css",
        "dist/css/timeline.css",
        "dist/css/sb-admin-2.css",
        "dist/css/morris.css",
        "dist/css/font-awesome.min.css",
        "dist/css/dataTable.css",
        "dist/css/timepicker.css",
        "dist/css/calendar.css",
        "dist/css/custom_2.css",
        "dist/css/app.css"
    ];

    stylesheets.forEach(cssPath => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = base + cssPath;
        document.head.appendChild(link);
    });

    // 3. Inject Layout Wrap once DOM content is loaded
    document.addEventListener("DOMContentLoaded", function () {
        const pageWrapper = document.getElementById('page-wrapper');
        if (!pageWrapper) return;

        // Create navigation based on user group
        let sidebarMenu = '';
        if (userRole === "UG001") { // Administrator Menu
            sidebarMenu = `
                <li><a href="${base}dashboard.html"><i class="fa fa-dashboard fa-fw"></i> Dashboard</a></li>
                <li>
                    <a href="#"><i class="fa fa-users fa-fw"></i> Students Manage<span class="fa arrow"></span></a>
                    <ul class="nav nav-second-level">
                        <li><a href="${base}ui/studentManage/admission.html">Admission</a></li>
                        <li><a href="${base}ui/studentManage/studentlist.html">Student List</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#"><i class="fa fa-users fa-fw"></i> Employee Manage<span class="fa arrow"></span></a>
                    <ul class="nav nav-second-level">
                        <li><a href="#" class="demo-link">Add New</a></li>
                        <li><a href="#" class="demo-link">List View</a></li>
                        <li><a href="#" class="demo-link">Salary Add</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#"><i class="fa fa-gears fa-fw"></i> Setup<span class="fa arrow"></span></a>
                    <ul class="nav nav-second-level">
                        <li><a href="${base}ui/setup/room.html">Rooms</a></li>
                        <li><a href="#" class="demo-link">Fees</a></li>
                        <li><a href="#" class="demo-link">Meal Rate</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#"><i class="fa fa-list-alt fa-fw"></i> Notice Board<span class="fa arrow"></span></a>
                    <ul class="nav nav-second-level">
                        <li><a href="${base}ui/notice/create.html">Notice Add/List</a></li>
                    </ul>
                </li>
            `;
        } else if (userRole === "UG003") { // Employee Menu
            sidebarMenu = `
                <li><a href="${base}edashboard.html"><i class="fa fa-dashboard fa-fw"></i> Employee Dashboard</a></li>
                <li>
                    <a href="#"><i class="fa fa-maxcdn fa-fw"></i> Meal Manage<span class="fa arrow"></span></a>
                    <ul class="nav nav-second-level">
                        <li><a href="#" class="demo-link">Add New Meal Entry</a></li>
                        <li><a href="#" class="demo-link">View Meals</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#"><i class="fa fa-list-alt fa-fw"></i> Notice Board<span class="fa arrow"></span></a>
                    <ul class="nav nav-second-level">
                        <li><a href="${base}ui/notice/create.html">Notice View</a></li>
                    </ul>
                </li>
            `;
        } else { // Student Menu
            sidebarMenu = `
                <li><a href="${base}sdashboard.html"><i class="fa fa-dashboard fa-fw"></i> Student Dashboard</a></li>
                <li><a href="#" class="demo-link"><i class="fa fa-money fa-fw"></i> My Payments</a></li>
                <li><a href="#" class="demo-link"><i class="fa fa-list-alt fa-fw"></i> Notices</a></li>
            `;
        }

        const layoutHtml = `
            <div id="wrapper">
                <!-- Navigation -->
                <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <img alt="HMS" class="pull-left" src="${base}site/images/logonav.png">
                        <a class="navbar-brand titlehms" href="${base}${userRole === 'UG004' ? 'sdashboard.html' : userRole === 'UG003' ? 'edashboard.html' : 'dashboard.html'}">Hostel Management System</a>
                    </div>

                    <ul class="nav navbar-top-links navbar-right">
                        <li>
                            <h5 class="titlehms" style="margin-right: 15px;"><i class="fa fa-user-circle"></i> ${session ? session.name : 'User'}</h5>
                        </li>
                        <li class="dropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                                <i class="fa fa-user fa-fw"></i> <i class="fa fa-caret-down"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-user">
                                <li><a href="#" class="demo-link"><i class="fa fa-gear fa-fw"></i> Settings</a></li>
                                <li class="divider"></li>
                                <li><a href="#" id="logout-btn"><i class="fa fa-sign-out fa-fw"></i> Logout</a></li>
                            </ul>
                        </li>
                    </ul>

                    <div class="navbar-default sidebar" role="navigation">
                        <div class="sidebar-nav navbar-collapse">
                            <ul class="nav" id="side-menu">
                                ${sidebarMenu}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        `;

        // Create layout container and wrap pageWrapper
        const bodyChildren = Array.from(document.body.children);
        const container = document.createElement('div');
        container.innerHTML = layoutHtml;
        document.body.insertBefore(container.firstElementChild, document.body.firstChild);
        
        const wrapper = document.getElementById('wrapper');
        wrapper.appendChild(pageWrapper);

        // Inject JS Scripts at the end of the body
        const scripts = [
            "dist/js/jquery.min.js",
            "dist/js/bootstrap.min.js",
            "dist/js/bootstrap-datepicker.js",
            "dist/js/metisMenu.min.js",
            "dist/js/sb-admin-2.js",
            "dist/js/dataTable.js",
            "dist/js/timepicker.js",
            "dist/js/modernizr.custom.63321.js",
            "dist/js/jquery.calendario.js",
            "dist/js/data.js",
            "dist/js/app.js"
        ];

        // Sequentially load scripts
        function loadScripts(index) {
            if (index >= scripts.length) {
                // Execute a custom callback if pages require initialization after JS load
                const event = new Event('layoutScriptsLoaded');
                document.dispatchEvent(event);
                return;
            }
            const script = document.createElement('script');
            script.src = base + scripts[index];
            script.onload = () => loadScripts(index + 1);
            document.body.appendChild(script);
        }

        loadScripts(0);

        // Set up logout button handler
        document.getElementById('logout-btn').addEventListener('click', function(e) {
            e.preventDefault();
            clearSession();
            window.location.href = base + 'index.html';
        });

        // Set up demo modal links
        document.querySelectorAll('.demo-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                alert("✨ Demo Mode: This screen is simulated for demonstration purposes. Only Admission, Student List, Rooms, and Notice Board are fully interactive in this GitHub Pages static project.");
            });
        });
    });
})();
