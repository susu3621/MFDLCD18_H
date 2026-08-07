# MFDLCD18_H MakeCode 扩展

这是适用于 **BBC micro:bit V2** 的 1.8 英寸彩色 LCD MakeCode 图形化扩展。硬件为 Waveshare 兼容模块，分辨率 160×128，LCD 驱动芯片为 ST7735S，并使用板载 23LC1024 SRAM 作为绘图缓存。

## 在 MakeCode 网页版中使用

1. 打开 [MakeCode for micro:bit](https://makecode.microbit.org/)，新建项目。
2. 点击“扩展”，在搜索框粘贴：

   ```text
   https://github.com/susu3621/MFDLCD18_H
   ```

3. 选择扩展后，工具箱会出现“1.8in LCD”积木分类。
4. 程序开头先使用“初始化 1.8in LCD”和“清空绘图缓存”积木。
5. 绘图完成后使用“在 LCD 显示绘图缓存”积木刷新屏幕。

坐标采用 1 起始：左上角为 `(1, 1)`，右下角为 `(160, 128)`。

## 快速示例

```typescript
LCD1IN8.LCD_Init()
LCD1IN8.LCD_SetBL(10)
LCD1IN8.LCD_ClearBuf()
LCD1IN8.DrawRectangle(
    10, 10, 150, 118,
    LCD1IN8.Get_Color(LCD_COLOR.BLUE),
    DRAW_FILL.DRAW_EMPTY,
    DOT_PIXEL.DOT_PIXEL_2
)
LCD1IN8.DisString(20, 55, "micro:bit V2", LCD1IN8.Get_Color(LCD_COLOR.RED))
LCD1IN8.LCD_Display()
```

## 积木功能

- 初始化 LCD、调节 0–10 级背光。
- 清屏、填充屏幕、清空 SRAM 绘图缓存、全屏或局部刷新。
- 绘制点、实线/虚线、空心/实心矩形和圆。
- 显示可打印 ASCII 文本与数字。
- 使用预设 RGB565 颜色，或由 RGB 数值生成自定义 RGB565 颜色。

“清屏”和“填充屏幕”会直接修改当前 LCD 画面；点、线、图形及文字会先写入板载 SRAM，需要调用全屏或局部刷新才能显示。

## 固定引脚

| 功能 | micro:bit 引脚 |
| --- | --- |
| SPI MOSI | P15 |
| SPI MISO | P14 |
| SPI SCK | P13 |
| LCD CS | P16 |
| SRAM CS | P2 |
| LCD DC | P12 |
| LCD RST | P8 |
| 背光 PWM | P1 |

## 本地验证

安装 Node.js 后，在仓库目录执行：

```bash
npx pxt target microbit v9.1.1
npx pxt build
```

`test.ts` 会在扩展作为顶层项目编译时覆盖所有公开积木 API。生成的 Universal Hex 可用于 micro:bit V2。

## 兼容性说明

本版本将旧 mbed C++ 驱动迁移为 MakeCode TypeScript，以兼容 micro:bit V2 的 CODAL 运行时和当前 MakeCode 网页编辑器。保留了原项目的 `LCD1IN8` 命名空间、常用函数名和枚举名，已有 TypeScript 项目可以继续迁移使用。

硬件初始化与引脚定义参考 Waveshare 的 micro:bit V2 驱动。字库支持 ASCII 字符 `32` 到 `126`；其他字符显示为问号。

## License

MIT
