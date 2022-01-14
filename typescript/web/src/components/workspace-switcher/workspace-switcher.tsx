import { gql, useQuery } from "@apollo/client";
import { Workspace } from "@labelflow/graphql-types";
import { startCase } from "lodash/fp";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { StringParam, useQueryParams } from "use-query-params";
import { BoolParam } from "../../utils/query-param-bool";
import { CreateWorkspaceModal } from "./create-workspace-modal";
import { WorkspaceMenu } from "./workspace-menu";
import { WorkspaceItem } from "./workspace-menu/workspace-selection-popover";

const getWorkspacesQuery = gql`
  query getWorkspaces {
    workspaces {
      id
      name
      slug
    }
  }
`;

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceSlug = router?.query.workspaceSlug as string;

  const [isOpen, setIsOpen] = useState(false);

  const [{ "modal-create-workspace": isCreationModalOpen }, setQueryParams] =
    useQueryParams({
      "modal-create-workspace": BoolParam,
      "workspace-name": StringParam,
    });

  const { data: getWorkspacesData, previousData: getWorkspacesPreviousData } =
    useQuery(getWorkspacesQuery);

  const workspaces: (Workspace & { src?: string })[] = useMemo(
    () => [
      { id: "local", slug: "local", name: "Local", src: null },
      ...(getWorkspacesData?.workspaces ??
        getWorkspacesPreviousData?.workspaces ??
        []),
    ],
    [getWorkspacesData?.workspaces, getWorkspacesPreviousData?.workspaces]
  );

  const selectedWorkspace = useMemo(() => {
    if (workspaceSlug == null) {
      return null;
    }
    if (workspaces == null) {
      return {
        id: "local",
        slug: workspaceSlug,
        name: startCase(workspaceSlug),
        src: null,
      };
    }
    return workspaces.find(({ slug }) => slug === workspaceSlug);
  }, [workspaceSlug, workspaces]);

  const setSelectedWorkspace = useCallback(
    (workspace: WorkspaceItem) => {
      const slug = workspace?.slug;
      if (slug !== null) {
        router.push(`/${slug}`);
      }
    },
    [router]
  );

  const createNewWorkspace = useCallback(
    async (name: string) => {
      setQueryParams(
        { "modal-create-workspace": true, "workspace-name": name },
        "replaceIn"
      );
    },
    [setQueryParams]
  );

  if (workspaces == null) {
    return null;
  }

  return (
    <>
      <WorkspaceMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        workspaces={workspaces}
        onSelectedWorkspaceChange={(workspace: WorkspaceItem) =>
          setSelectedWorkspace(workspace)
        }
        createNewWorkspace={createNewWorkspace}
        selectedWorkspace={selectedWorkspace == null ? null : selectedWorkspace}
      />
      <CreateWorkspaceModal
        isOpen={isCreationModalOpen}
        onClose={() => {
          setQueryParams(
            { "modal-create-workspace": false, "workspace-name": null },
            "replaceIn"
          );
        }}
      />
    </>
  );
};
