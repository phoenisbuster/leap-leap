const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelData 
{
    static initTime = 30;

    static allowClockAt = 10;

    static ClockAppearCount = 8;

    static ClockAppearInterval = 6;

    static DifficultyUpEvery = 10;

    static ClockAppearCountUp = 4;

    static ClockAppearIntervalUp = 3;

    static usedDifficulty = false;

    static BG_List: number[] = [];

    static TranBG_List: number[] = [];

    static useBG = false;

    static MaximumRow = 3;

    static MaximumPlatsPerRow = 4;

    static usedPlat = false;

    static TimeScale = 0.25;

    static PlayCutScene = false;
}
