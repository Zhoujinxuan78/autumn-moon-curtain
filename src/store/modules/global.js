"use strict";
// import { defineStore } from "pinia";
// import { store } from "@/store";
// import * as api from '@/apis';
// import { RES_COMMON_CODE } from "@mono/network/constant";
// import { getMyUserInfo } from "@mono/bridge";
// import { AWARD_TYPE } from "@mono/constants";
// import {ACTIVITY_PROGRESS_TYPE} from "@/constants";
// interface LevelInfo {
//   currLevel: number;
//   expireTs: number;
//   nextLevelName: string;
//   score: number;
// }
// interface MyUserInfo {
//   levelType2LevelInfoMap: Record<number, LevelInfo>;
//   svipLevel: number;
//   vipLevel: number;
//   [key: string]: any;
// }
// export const useGlobalStore = defineStore("gobal", {
//   state: () => ({
//     localeState: "zh",
//     dailyTaskId: 0,
//     monthTaskId: 0,
//     bubbleTaskId:0,
//     lotteryId: 0,
//     weeklyTaskId: 0,
//     myUserInfo: {} as MyUserInfo,
//     totalRankBoardInfo: {
//       rankBoardList: [],
//       rankboardInfo: {
//         rankReward: [],
//         endTime: 0
//       },
//       selfRankInfo: {}
//     },
//     progressActivityInfo: {
//       progressValue: 0,
//       progressesRewardInfo: [],
//       endTime: 0
//     },
//     dailyProgressActivityInfo: {
//       progressValue: 0,
//       progressesRewardInfo: [],
//       endTime: 0,
//       currencyUserInfo:{
//         amount: 0,
//         totalMember: 0,//参与活动的人数
//         rank: 0,//用户排名
//       }
//     },
//     monthProgressActivityInfo: {
//       progressValue: 0,
//       progressesRewardInfo: [],
//       endTime: 0,
//       currencyUserInfo:{
//         amount: 0,
//         totalMember: 0,//参与活动的人数
//         rank: 0,//用户排名
//       }
//     },
//     bubbleProgressActivityInfo: {
//       progressValue: 0,
//       progressesRewardInfo: [],
//       endTime: 0,
//       currencyUserInfo:{
//         amount: 0,
//         totalMember: 0,//参与活动的人数
//         rank: 0,//用户排名
//       }
//     },
//     weeklyProgressActivityInfo: {
//       progressValue: 0,
//       progressesRewardInfo: [],
//       endTime: 0,
//     },
//     userMedalsList: [],
//     userMedalsrecords:{}
//   }),
//   actions: {
//     setAppName(locale: string) {
//       this.localeState = locale;
//     },
//     async getMyInfo() {
//       const myUserInfo = await getMyUserInfo();
//       this.myUserInfo = myUserInfo;
//     },
//     async updateActivityId(activityIdMap: Record<string, number>) {
//       this.dailyTaskId = activityIdMap.dailyTaskId || 0;
//       this.monthTaskId = activityIdMap.monthTaskId || 0;
//       this.bubbleTaskId = activityIdMap.bubbleTaskId || 0;
//       this.lotteryId = activityIdMap.lotteryId || 0;
//       this.weeklyTaskId = activityIdMap.weeklyTaskId || 0;
//     },
//     async getTaskProgressInfo(type: number) {
//       const activityIdMap: Record<number, number | undefined> = {
//         [ACTIVITY_PROGRESS_TYPE.DAILY_TASK]: this.dailyTaskId,
//         [ACTIVITY_PROGRESS_TYPE.MONTH_TASK]: this.monthTaskId,
//         [ACTIVITY_PROGRESS_TYPE.BUBBLE_TASK]: this.bubbleTaskId,
//         [ACTIVITY_PROGRESS_TYPE.WEEKLY_TASK]: this.weeklyTaskId,
//       };
//       type ProgressInfoKey = 'dailyProgressActivityInfo' | 'weeklyProgressActivityInfo' | 'monthProgressActivityInfo' | 'bubbleProgressActivityInfo';
//       const variableMap: Record<number, ProgressInfoKey> = {
//         [ACTIVITY_PROGRESS_TYPE.DAILY_TASK]: 'dailyProgressActivityInfo',
//         [ACTIVITY_PROGRESS_TYPE.MONTH_TASK]: 'monthProgressActivityInfo',
//         [ACTIVITY_PROGRESS_TYPE.BUBBLE_TASK]: 'bubbleProgressActivityInfo',
//         [ACTIVITY_PROGRESS_TYPE.WEEKLY_TASK]: 'weeklyProgressActivityInfo',
//       };
//       const activityId = activityIdMap[type];
//       const targetKey = variableMap[type];
//       if (!activityId || !targetKey) return;
//       const { code, data } = await api.getProgressActivityInfo(activityId);
//       if (code === RES_COMMON_CODE.SUCCESS) {
//         (this as any)[targetKey] = data;
//       }
//     },
//     async getReward(payload: Record<string, number>) {
//       const { activityId, progressId } = payload;
//       const res = await api.getReward(activityId, progressId);
//       const { code } = res;
//       if (code !== RES_COMMON_CODE.SUCCESS) return;
//       const idTypeMap: Record<number, number> = {
//         [this.dailyTaskId]: ACTIVITY_PROGRESS_TYPE.DAILY_TASK,
//         [this.monthTaskId]: ACTIVITY_PROGRESS_TYPE.MONTH_TASK,
//         [this.bubbleTaskId]: ACTIVITY_PROGRESS_TYPE.BUBBLE_TASK,
//         [this.weeklyTaskId]: ACTIVITY_PROGRESS_TYPE.WEEKLY_TASK,
//       };
//       const type = idTypeMap[activityId];
//       if (type !== undefined) {
//         await this.getTaskProgressInfo(type);
//       }
//     },
//     async getUserMedals() {
//       const res = await api.getUserMedals(this.medalRewardIds);
//       const { code, data } = res;
//       if (code !== RES_COMMON_CODE.SUCCESS) {
//         return;
//       }
//       this.userMedalsList = data;
//     },
//     async getUserMedalRecords() {
//       const res = await api.getUserMedalRecords(this.medalRewardIds);
//       const { code, data } = res;
//       if (code !== RES_COMMON_CODE.SUCCESS) {
//         return;
//       }
//       this.userMedalsrecords = data.medalId2MedalRecordsMap || {};
//     },
//   },
//   getters: {
//     locale: (state) => state.localeState,
//     progressValue: (state) => state.progressActivityInfo?.progressValue ?? 0,
//     progressesRewardInfo: (state) => state.progressActivityInfo?.progressesRewardInfo ?? [],
//     dailyProgressValue: (state) => state.dailyProgressActivityInfo?.progressValue ?? 0,
//     dailyProgressesRewardInfo: (state) => state.dailyProgressActivityInfo?.progressesRewardInfo ?? [],
//     monthProgressValue: (state) => state.monthProgressActivityInfo?.progressValue ?? 0,
//     monthProgressesRewardInfo: (state) => state.monthProgressActivityInfo?.progressesRewardInfo ?? [],
//     bubbleProgressValue: (state) => state.bubbleProgressActivityInfo?.progressValue ?? 0,
//     bubbleProgressesRewardInfo: (state) => state.bubbleProgressActivityInfo?.progressesRewardInfo ?? [],
//     weeklyProgressValue: (state) => state.weeklyProgressActivityInfo?.progressValue ?? 0,
//     weeklyProgressesRewardInfo: (state) => state.weeklyProgressActivityInfo?.progressesRewardInfo ?? [],
//     medalRewardList: (state) => {
//       const progressesRewardInfo = state.monthProgressActivityInfo?.progressesRewardInfo ?? [];
//       return progressesRewardInfo.flatMap((info: any) => {
//         return (info.rewardPackage ?? []).filter(
//           (reward: any) => reward.rewardResourceType === AWARD_TYPE.MEDAL
//         );
//       });
//     },
//     medalRewardIds: (state) => {
//       return state.medalRewardList.map((reward: any) => reward.rewardResourceId); 
//     },
//   }
// });
// export function useGlobalStoreHook() {
//   return useGlobalStore(store);
// }
//# sourceMappingURL=global.js.map