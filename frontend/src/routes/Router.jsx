import { Route, Routes } from "react-router-dom";

import { GenericError } from "../components/error/GenericError/GenericError.jsx";
import { NotFound } from "../components/error/NotFound/NotFound.jsx";
import { PersistentLogin } from "../components/helpers/auth/PersistentLogin.js";
import { RequireAdmin } from "../components/helpers/auth/RequireAdmin.js";
import { RequireAuth } from "../components/helpers/auth/RequireAuth.js";
import { RequireGuest } from "../components/helpers/auth/RequireGuest.js";
import { CustomToolsHelper } from "../components/helpers/custom-tools/CustomToolsHelper.js";
import { ProjectHelper } from "../components/helpers/project/ProjectHelper.js";
import { OAuthStatus } from "../components/oauth-ds/oauth-status/OAuthStatus.jsx";
import { DefaultTriad } from "../components/settings/default-triad/DefaultTriad.jsx";
import { PlatformSettings } from "../components/settings/platform/PlatformSettings.jsx";
import { deploymentTypes } from "../helpers/GetStaticData.js";
import { FullPageLayout } from "../layouts/fullpage-payout/FullPageLayout.jsx";
import { PageLayout } from "../layouts/page-layout/PageLayout.jsx";
import { AgencyPage } from "../pages/AgencyPage.jsx";
import { CustomTools } from "../pages/CustomTools.jsx";
import { DeploymentsPage } from "../pages/DeploymentsPage.jsx";
import { InviteEditUserPage } from "../pages/InviteEditUserPage.jsx";
import { LandingPage } from "../pages/LandingPage.jsx";
import { OnBoardPage } from "../pages/OnBoardPage.jsx";
import { PipelinesOrDeploymentsPage } from "../pages/PipelinesOrDeploymentsPage.jsx";
import { ProfilePage } from "../pages/ProfilePage.jsx";
import { SettingsPage } from "../pages/SettingsPage.jsx";
import { ToolIdePage } from "../pages/ToolIdePage.jsx";
import { ToolsSettingsPage } from "../pages/ToolsSettingsPage.jsx";
import { UsersPage } from "../pages/UsersPage.jsx";
import { WorkflowsPage } from "../pages/WorkflowsPage.jsx";
import { OutputAnalyzerPage } from "../pages/OutputAnalyzerPage.jsx";
import { SetOrgPage } from "../pages/SetOrgPage.jsx";

let TrialRoutes;
try {
  TrialRoutes =
    require("../plugins/subscription/trial-page/TrialEndPage.jsx").TrialEndPage;
} catch (err) {
  TrialRoutes = NotFound;
}

function Router() {
  return (
    <Routes>
      <Route path="error" element={<GenericError />} />
      <Route path="" element={<PersistentLogin />}>
        {/* public routes */}
        <Route path="" element={<RequireGuest />}>
          <Route path="landing" element={<LandingPage />} />
        </Route>
        {/* protected routes */}
        <Route path="setOrg" element={<SetOrgPage />} />
        <Route path="" element={<RequireAuth />}>
          <Route path=":orgName" element={<FullPageLayout />}>
            <Route path="onboard" element={<OnBoardPage />} />
          </Route>
          <Route path=":orgName" element={<PageLayout />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="api"
              element={<DeploymentsPage type={deploymentTypes.api} />}
            />
            <Route
              path="etl"
              element={<DeploymentsPage type={deploymentTypes.etl} />}
            />
            <Route
              path="task"
              element={<DeploymentsPage type={deploymentTypes.task} />}
            />
            <Route
              path="app"
              element={<PipelinesOrDeploymentsPage type="app" />}
            />
            <Route path="workflows" element={<WorkflowsPage />} />
            <Route path="workflows/:id" element={<ProjectHelper />}>
              <Route path="" element={<AgencyPage />} />
            </Route>
            <Route path="tools" element={<CustomTools />} />
            <Route path="" element={<CustomToolsHelper />}>
              <Route path="tools/:id" element={<ToolIdePage />} />
              <Route
                path="tools/:id/outputAnalyzer"
                element={<OutputAnalyzerPage />}
              />
            </Route>
            <Route
              path="settings/llms"
              element={<ToolsSettingsPage type="llm" />}
            />
            <Route
              path="settings/vectorDbs"
              element={<ToolsSettingsPage type="vector_db" />}
            />
            <Route
              path="settings/embedding"
              element={<ToolsSettingsPage type="embedding" />}
            />
            <Route
              path="settings/textExtractor"
              element={<ToolsSettingsPage type="x2text" />}
            />
            <Route
              path="settings/ocr"
              element={<ToolsSettingsPage type="ocr" />}
            />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="settings/platform" element={<PlatformSettings />} />
            <Route element={<RequireAdmin />}>
              <Route path="users" element={<UsersPage />} />
              <Route path="users/invite" element={<InviteEditUserPage />} />
              <Route path="users/edit" element={<InviteEditUserPage />} />
            </Route>
            <Route path="settings/triad" element={<DefaultTriad />} />
          </Route>
        </Route>
        {TrialRoutes && (
          <Route path="/trial-expired" element={<TrialRoutes />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="oauth-status" element={<OAuthStatus />} />
    </Routes>
  );
}

export { Router };
