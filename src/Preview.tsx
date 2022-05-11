import {
  ConfigType,
  ExtensionType,
  FormSidebarExtensionDeclaration,
  useFormSidebarExtension,
  Wrapper,
} from "@graphcms/uix-react-sdk";
import React, { useEffect, useMemo, useState } from "react";

const declaration: FormSidebarExtensionDeclaration = {
  extensionType: ExtensionType.formSidebar,
  name: "Custom URL Preview",
  description: "Better cusomisation for preview urls",
  config: {},
  sidebarConfig: {
    URL_TEMPLATE: {
      type: ConfigType.string,
      displayName: "The preview URL",
      description: `The preview URL as a javascript interpolated string.`,
      required: true,
    },
  },
};

const dynamicTemplate = (template: string, vars: Record<string, any>) => {
  // eslint-disable-next-line no-new-func
  const handler = new Function(
    "vars",
    "const tagged = (" +
      Object.keys(vars).join(",") +
      ") => `" +
      template +
      "`; return tagged(...Object.values(vars))"
  );
  return handler(vars);
};

function usePreviewUrl(template: string, values: Record<string, any>) {
  const populatedUrl = useMemo(() => {
    try {
      // eslint-disable-next-line no-new-func
      const result = dynamicTemplate(template, values);
      return result;
    } catch (error) {
      console.log("error", error);
      return (error as Error).message;
    }
  }, [template, values]);

  return populatedUrl;
}

const Preview: React.FC = () => {
  const details = useFormSidebarExtension();
  const {
    extension: { sidebarConfig },
    form: { subscribeToFormState, getState },
  } = details;

  const [values, setValues] = useState<Record<string, any>>(() => getState());

  useEffect(() => {
    let unsubscribe: (() => any) | undefined;

    subscribeToFormState(
      (sub) => {
        setValues(sub.values);
      },
      {
        active: true,
        touched: true,
        values: true,
        initialValues: true,
        submitSucceeded: true,
      }
    )
      .then((u) => (unsubscribe = u))
      .catch((error) => console.error("error in sub", error));

    return () => {
      unsubscribe?.();
    };
  }, [subscribeToFormState]);

  const populatedUrl = usePreviewUrl(
    sidebarConfig.URL_TEMPLATE as string,
    values
  );

  return (
    <a href={populatedUrl} target="_blank" rel="noreferrer">
      Open Preview
    </a>
  );
};

export const MainPreview: React.FC = () => {
  const uid = useMemo(() => {
    return (
      new URLSearchParams(document.location.search).get("extensionUid") ||
      undefined
    );
  }, []);
  return (
    <Wrapper declaration={declaration} uid={uid} debug={true}>
      <Preview />
    </Wrapper>
  );
};
