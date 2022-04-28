import {
  ConfigType,
  ExtensionType,
  FormSidebarExtensionDeclaration,
  useFormSidebarExtension,
  Wrapper,
} from "@graphcms/uix-react-sdk";
import React, { useMemo } from "react";

const declaration: FormSidebarExtensionDeclaration = {
  extensionType: ExtensionType.formSidebar,
  name: "Custom URL Preview",
  description: "Better cusomisation for preview urls",
  config: {
    WEBSITE_URL: {
      type: ConfigType.string,
      displayName: "Base URL",
      description: "Base URL of the website to preview under",
      required: true,
    },
  },
  sidebarConfig: {
    GENERAL: {
      type: ConfigType.string,
      displayName: "Basic config type",
      description: "What value is this?",
      required: false,
    },
  },
};

const Preview: React.FC = () => {
  const details = useFormSidebarExtension();
  console.log("got details", details);
  return (
    <div>
      <h2>Preview page</h2>
    </div>
  );
};

export const MainPreview: React.FC = () => {
  const uid = useMemo(() => {
    return (
      new URLSearchParams(document.location.search).get("extensionUid") ||
      undefined
    );
  }, []);
  console.log("location", document.location, "uid", uid);
  return (
    <Wrapper declaration={declaration} uid={uid} debug={true}>
      <Preview />
    </Wrapper>
  );
};
