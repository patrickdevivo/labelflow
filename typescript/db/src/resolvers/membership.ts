import { Context } from "@labelflow/common-resolvers";
import {
  MutationCreateMembershipArgs,
  MutationDeleteMembershipArgs,
  MutationUpdateMembershipArgs,
  QueryMembershipArgs,
  QueryMembershipsArgs,
} from "@labelflow/graphql-types";
import { Prisma } from "@prisma/client";
import {
  checkUserAccessToMembership,
  checkUserAccessToWorkspace,
} from "../repository/access-control";
import { getPrismaClient, PrismaClient } from "../prisma-client";

const membership = async (
  _: any,
  args: QueryMembershipArgs,
  { user }: Context
) => {
  await checkUserAccessToMembership({ where: args.where, user });
  const membershipFromDb = await (
    await getPrismaClient()
  ).membership.findUnique({
    where: { id: args.where.id },
  });

  if (membershipFromDb == null) {
    throw new Error(`Couldn't find a membership with id: "${args.where.id}"`);
  }

  return membershipFromDb;
};

const memberships = async (
  _: any,
  args: QueryMembershipsArgs,
  { user }: Context
) => {
  if (user?.id == null) {
    return [];
  }
  return await (
    await getPrismaClient()
  ).membership.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: Prisma.SortOrder.asc },
    skip: args?.skip ?? undefined,
    take: args.first ?? undefined,
  });
};

const createMembership = async (
  _: any,
  args: MutationCreateMembershipArgs,
  { user }: Context
) => {
  await checkUserAccessToWorkspace({
    user,
    where: { slug: args.data.workspaceSlug },
  });
  return await (
    await getPrismaClient()
  ).membership.create({
    data: { ...args.data, id: args.data?.id ?? undefined },
  });
};

const updateMembership = async (
  _: any,
  args: MutationUpdateMembershipArgs,
  { user }: Context
) => {
  await checkUserAccessToMembership({ where: args.where, user });
  return await (
    await getPrismaClient()
  ).membership.update({
    where: args.where,
    data: { ...args.data, role: args.data?.role ?? undefined },
  });
};

const deleteMembership = async (
  _: any,
  args: MutationDeleteMembershipArgs,
  { user }: Context
) => {
  await checkUserAccessToMembership({ where: args.where, user });
  return await (
    await getPrismaClient()
  ).membership.delete({
    where: args.where,
  });
};

const user = async (
  parent: NonNullable<
    Prisma.PromiseReturnType<PrismaClient["membership"]["findUnique"]>
  >
) => {
  return await (
    await getPrismaClient()
  ).user.findUnique({
    where: { id: parent.userId },
  });
};

const workspace = async (
  parent: NonNullable<
    Prisma.PromiseReturnType<PrismaClient["membership"]["findUnique"]>
  >
) => {
  return await (
    await getPrismaClient()
  ).workspace.findUnique({
    where: { slug: parent.workspaceSlug },
  });
};

export default {
  Query: { membership, memberships },
  Mutation: { createMembership, updateMembership, deleteMembership },
  Membership: { user, workspace },
};
