import { createChatRoom } from "@/actions/chats";
import {
  getCachedGatheringPost,
  getGathering,
  getIsOwner,
} from "@/actions/gatherings";
import { createParticipant } from "@/actions/gatherings/[id]";
import { SubmitButton } from "@/components/common/SubmitButton";
import Countdown from "@/components/gatherings/CountDown";
import GatheringModalContainer from "@/components/gatherings/GatheringModalContainer";
import { Button } from "@/components/ui/button";
import getSession from "@/lib/session";
import { formatToTimeAgo, formatToWon, isPastEndDate } from "@/lib/utils";
import {
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const gathering = await getGathering(+params.id);
  return {
    title: gathering?.title,
  };
}

export default async function GatheringModal({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const gathering = await getGathering(id);
  if (!gathering) {
    return notFound();
  }
  const session = await getSession();
  const isOwner = await getIsOwner(gathering.userId, session.id);

  const disabledButtonValue = () => {
    if (
      isPastEndDate(gathering.endDate) ||
      gathering.status === "closed" ||
      gathering.maxParticipants === gathering.participants.length
    ) {
      return true;
    }
    return false;
  };

  const startChat = async () => {
    "use server";
    await createChatRoom(gathering.userId);
  };

  const applyForMeeting = async () => {
    "use server";
    await createParticipant(session.id, gathering.id);
  };

  return (
    <GatheringModalContainer>
      <div className="aspect-[16/6] h-full w-full">
        <div className="text-neutral-200 relative flex justify-center rounded-t-xl items-center overflow-hidden h-full">
          <Image
            fill
            priority
            sizes="400px"
            src={gathering.photo}
            alt={gathering.title}
            className="object-cover"
          />
        </div>
      </div>
      <div className="p-5 flex items-center justify-between border-b border-gray-300">
        <div className="flex items-center gap-3">
          <div className="size-10 overflow-hidden rounded-full">
            {gathering.user.avatar !== null ? (
              <Image
                src={gathering.user.avatar}
                alt={gathering.user.username}
                width={40}
                height={40}
              />
            ) : (
              <UserIcon className="size-10 rounded-full" />
            )}
          </div>
          <div>
            <h3>{gathering.user.username}</h3>
          </div>
        </div>
        <div className="flex">
          {isOwner ? (
            <Button asChild>
              <Link href={`/gatherings/post/${id}/edit`}>
                <PencilSquareIcon className="h-[25px]" />
              </Link>
            </Button>
          ) : (
            <div className="flex gap-4">
              <form action={applyForMeeting}>
                <SubmitButton
                  disabled={disabledButtonValue()}
                  variant={disabledButtonValue() ? "secondary" : "default"}
                >
                  모임 신청
                </SubmitButton>
              </form>
              <form action={startChat}>
                <SubmitButton>
                  <ChatBubbleLeftRightIcon className="h-[25px]" />
                </SubmitButton>
              </form>
            </div>
          )}
        </div>
      </div>
      <div className="h-full flex flex-col p-5 gap-0.5 overflow-y-auto max-h-[200px] scrollbar-hide">
        <h1 className="text-xl font-medium">{gathering.title}</h1>
        <div className="flex gap-1 items-center *:text-gray-400">
          <span className="text-xs text-neutral-500">{gathering.location}</span>
          <span>·</span>
          <Countdown endDate={gathering.endDate} />
        </div>
        <span className="text-lg font-bold">
          {formatToWon(gathering.price)}원
        </span>
        <p className="mt-4 text-neutral-900 text-sm">{gathering.description}</p>
      </div>
    </GatheringModalContainer>
  );
}
