/*****************************************************************************
* | File      	:   1in8LCD.ts
* | Author      :   hnwangkg-ezio for Waveshare
* | Function    :   Contorl 1.8inch lcd Show
* | Info        :
*----------------
* | This version:   V2.0
* | Date        :   2021-01-28
* | Info        :   for micro:bit v2
*
******************************************************************************/
const GUI_BACKGROUND_COLOR = 0xFFFF

const LCD_WIDTH = 160
const LCD_HEIGHT = 128

// SRAM opcodes
const SRAM_CMD_WRSR = 0x01
const SRAM_CMD_READ = 0x03
const SRAM_CMD_WRITE = 0x02

// SRAM modes
const SRAM_BYTE_MODE = 0x00
const SRAM_STREAM_MODE = 0x40

/** Standard RGB565 colors for the LCD. */
enum LCD_COLOR {
    //% block="white"
    WHITE = 0xFFFF,
    //% block="black"
    BLACK = 0x0000,
    //% block="blue"
    BLUE = 0x001F,
    //% block="purple red"
    BRED = 0XF81F,
    //% block="green yellow"
    GRED = 0XFFE0,
    //% block="cyan blue"
    GBLUE = 0X07FF,
    //% block="red"
    RED = 0xF800,
    //% block="magenta"
    MAGENTA = 0xF81F,
    //% block="green"
    GREEN = 0x07E0,
    //% block="cyan"
    CYAN = 0x7FFF,
    //% block="yellow"
    YELLOW = 0xFFE0,
    //% block="brown"
    BROWN = 0XBC40,
    //% block="bright red"
    BRRED = 0XFC07,
    //% block="gray"
    GRAY = 0X8430
}

/** Drawing thickness in pixels. */
enum DOT_PIXEL {
    //% block="1 pixel"
    DOT_PIXEL_1 = 1,
    //% block="2 pixels"
    DOT_PIXEL_2,
    //% block="3 pixels"
    DOT_PIXEL_3,
    //% block="4 pixels"
    DOT_PIXEL_4
}

enum LINE_STYLE {
    //% block="solid"
    LINE_SOLID = 0,
    //% block="dotted"
    LINE_DOTTED
}

enum DRAW_FILL {
    //% block="outline"
    DRAW_EMPTY = 0,
    //% block="filled"
    DRAW_FULL
}

const Font12_Table: number[] =
[
    // @0 ' ' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //

    // @12 '!' (7 pixels wide)
    0x00, //
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x00, //
    0x00, //
    0x10, //    #
    0x00, //
    0x00, //
    0x00, //

    // @24 '"' (7 pixels wide)
    0x00, //
    0x6C, //  ## ##
    0x48, //  #  #
    0x48, //  #  #
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //

    // @36 '#' (7 pixels wide)
    0x00, //
    0x14, //    # #
    0x14, //    # #
    0x28, //   # #
    0x7C, //  #####
    0x28, //   # #
    0x7C, //  #####
    0x28, //   # #
    0x50, //  # #
    0x50, //  # #
    0x00, //
    0x00, //

    // @48 '$' (7 pixels wide)
    0x00, //
    0x10, //    #
    0x38, //   ###
    0x40, //  #
    0x40, //  #
    0x38, //   ###
    0x48, //  #  #
    0x70, //  ###
    0x10, //    #
    0x10, //    #
    0x00, //
    0x00, //

    // @60 '%' (7 pixels wide)
    0x00, //
    0x20, //   #
    0x50, //  # #
    0x20, //   #
    0x0C, //     ##
    0x70, //  ###
    0x08, //     #
    0x14, //    # #
    0x08, //     #
    0x00, //
    0x00, //
    0x00, //

    // @72 '&' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x18, //    ##
    0x20, //   #
    0x20, //   #
    0x54, //  # # #
    0x48, //  #  #
    0x34, //   ## #
    0x00, //
    0x00, //
    0x00, //

    // @84 ''' (7 pixels wide)
    0x00, //
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //

    // @96 '(' (7 pixels wide)
    0x00, //
    0x08, //     #
    0x08, //     #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x08, //     #
    0x08, //     #
    0x00, //

    // @108 ')' (7 pixels wide)
    0x00, //
    0x20, //   #
    0x20, //   #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x20, //   #
    0x20, //   #
    0x00, //

    // @120 '*' (7 pixels wide)
    0x00, //
    0x10, //    #
    0x7C, //  #####
    0x10, //    #
    0x28, //   # #
    0x28, //   # #
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //

    // @132 '+' (7 pixels wide)
    0x00, //
    0x00, //
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0xFE, // #######
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x00, //
    0x00, //
    0x00, //

    // @144 ',' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x18, //    ##
    0x10, //    #
    0x30, //   ##
    0x20, //   #
    0x00, //

    // @156 '-' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x7C, //  #####
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //

    // @168 '.' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x30, //   ##
    0x30, //   ##
    0x00, //
    0x00, //
    0x00, //

    // @180 '/' (7 pixels wide)
    0x00, //
    0x04, //      #
    0x04, //      #
    0x08, //     #
    0x08, //     #
    0x10, //    #
    0x10, //    #
    0x20, //   #
    0x20, //   #
    0x40, //  #
    0x00, //
    0x00, //

    // @192 '0' (7 pixels wide)
    0x00, //
    0x38, //   ###
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x38, //   ###
    0x00, //
    0x00, //
    0x00, //

    // @204 '1' (7 pixels wide)
    0x00, //
    0x30, //   ##
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x7C, //  #####
    0x00, //
    0x00, //
    0x00, //

    // @216 '2' (7 pixels wide)
    0x00, //
    0x38, //   ###
    0x44, //  #   #
    0x04, //      #
    0x08, //     #
    0x10, //    #
    0x20, //   #
    0x44, //  #   #
    0x7C, //  #####
    0x00, //
    0x00, //
    0x00, //

    // @228 '3' (7 pixels wide)
    0x00, //
    0x38, //   ###
    0x44, //  #   #
    0x04, //      #
    0x18, //    ##
    0x04, //      #
    0x04, //      #
    0x44, //  #   #
    0x38, //   ###
    0x00, //
    0x00, //
    0x00, //

    // @240 '4' (7 pixels wide)
    0x00, //
    0x0C, //     ##
    0x14, //    # #
    0x14, //    # #
    0x24, //   #  #
    0x44, //  #   #
    0x7E, //  ######
    0x04, //      #
    0x0E, //     ###
    0x00, //
    0x00, //
    0x00, //

    // @252 '5' (7 pixels wide)
    0x00, //
    0x3C, //   ####
    0x20, //   #
    0x20, //   #
    0x38, //   ###
    0x04, //      #
    0x04, //      #
    0x44, //  #   #
    0x38, //   ###
    0x00, //
    0x00, //
    0x00, //

    // @264 '6' (7 pixels wide)
    0x00, //
    0x1C, //    ###
    0x20, //   #
    0x40, //  #
    0x78, //  ####
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x38, //   ###
    0x00, //
    0x00, //
    0x00, //

    // @276 '7' (7 pixels wide)
    0x00, //
    0x7C, //  #####
    0x44, //  #   #
    0x04, //      #
    0x08, //     #
    0x08, //     #
    0x08, //     #
    0x10, //    #
    0x10, //    #
    0x00, //
    0x00, //
    0x00, //

    // @288 '8' (7 pixels wide)
    0x00, //
    0x38, //   ###
    0x44, //  #   #
    0x44, //  #   #
    0x38, //   ###
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x38, //   ###
    0x00, //
    0x00, //
    0x00, //

    // @300 '9' (7 pixels wide)
    0x00, //
    0x38, //   ###
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x3C, //   ####
    0x04, //      #
    0x08, //     #
    0x70, //  ###
    0x00, //
    0x00, //
    0x00, //

    // @312 ':' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x30, //   ##
    0x30, //   ##
    0x00, //
    0x00, //
    0x30, //   ##
    0x30, //   ##
    0x00, //
    0x00, //
    0x00, //

    // @324 ';' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x18, //    ##
    0x18, //    ##
    0x00, //
    0x00, //
    0x18, //    ##
    0x30, //   ##
    0x20, //   #
    0x00, //
    0x00, //

    // @336 '<' (7 pixels wide)
    0x00, //
    0x00, //
    0x0C, //     ##
    0x10, //    #
    0x60, //  ##
    0x80, // #
    0x60, //  ##
    0x10, //    #
    0x0C, //     ##
    0x00, //
    0x00, //
    0x00, //

    // @348 '=' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x7C, //  #####
    0x00, //
    0x7C, //  #####
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //

    // @360 '>' (7 pixels wide)
    0x00, //
    0x00, //
    0xC0, // ##
    0x20, //   #
    0x18, //    ##
    0x04, //      #
    0x18, //    ##
    0x20, //   #
    0xC0, // ##
    0x00, //
    0x00, //
    0x00, //

    // @372 '?' (7 pixels wide)
    0x00, //
    0x00, //
    0x18, //    ##
    0x24, //   #  #
    0x04, //      #
    0x08, //     #
    0x10, //    #
    0x00, //
    0x30, //   ##
    0x00, //
    0x00, //
    0x00, //

    // @384 '@' (7 pixels wide)
    0x38, //   ###
    0x44, //  #   #
    0x44, //  #   #
    0x4C, //  #  ##
    0x54, //  # # #
    0x54, //  # # #
    0x4C, //  #  ##
    0x40, //  #
    0x44, //  #   #
    0x38, //   ###
    0x00, //
    0x00, //

    // @396 'A' (7 pixels wide)
    0x00, //
    0x30, //   ##
    0x10, //    #
    0x28, //   # #
    0x28, //   # #
    0x28, //   # #
    0x7C, //  #####
    0x44, //  #   #
    0xEE, // ### ###
    0x00, //
    0x00, //
    0x00, //

    // @408 'B' (7 pixels wide)
    0x00, //
    0xF8, // #####
    0x44, //  #   #
    0x44, //  #   #
    0x78, //  ####
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0xF8, // #####
    0x00, //
    0x00, //
    0x00, //

    // @420 'C' (7 pixels wide)
    0x00, //
    0x3C, //   ####
    0x44, //  #   #
    0x40, //  #
    0x40, //  #
    0x40, //  #
    0x40, //  #
    0x44, //  #   #
    0x38, //   ###
    0x00, //
    0x00, //
    0x00, //

    // @432 'D' (7 pixels wide)
    0x00, //
    0xF0, // ####
    0x48, //  #  #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x48, //  #  #
    0xF0, // ####
    0x00, //
    0x00, //
    0x00, //

    // @444 'E' (7 pixels wide)
    0x00, //
    0xFC, // ######
    0x44, //  #   #
    0x50, //  # #
    0x70, //  ###
    0x50, //  # #
    0x40, //  #
    0x44, //  #   #
    0xFC, // ######
    0x00, //
    0x00, //
    0x00, //

    // @456 'F' (7 pixels wide)
    0x00, //
    0x7E, //  ######
    0x22, //   #   #
    0x28, //   # #
    0x38, //   ###
    0x28, //   # #
    0x20, //   #
    0x20, //   #
    0x70, //  ###
    0x00, //
    0x00, //
    0x00, //

    // @468 'G' (7 pixels wide)
    0x00, //
    0x3C, //   ####
    0x44, //  #   #
    0x40, //  #
    0x40, //  #
    0x4E, //  #  ###
    0x44, //  #   #
    0x44, //  #   #
    0x38, //   ###
    0x00, //
    0x00, //
    0x00, //

    // @480 'H' (7 pixels wide)
    0x00, //
    0xEE, // ### ###
    0x44, //  #   #
    0x44, //  #   #
    0x7C, //  #####
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0xEE, // ### ###
    0x00, //
    0x00, //
    0x00, //

    // @492 'I' (7 pixels wide)
    0x00, //
    0x7C, //  #####
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x7C, //  #####
    0x00, //
    0x00, //
    0x00, //

    // @504 'J' (7 pixels wide)
    0x00, //
    0x3C, //   ####
    0x08, //     #
    0x08, //     #
    0x08, //     #
    0x48, //  #  #
    0x48, //  #  #
    0x48, //  #  #
    0x30, //   ##
    0x00, //
    0x00, //
    0x00, //

    // @516 'K' (7 pixels wide)
    0x00, //
    0xEE, // ### ###
    0x44, //  #   #
    0x48, //  #  #
    0x50, //  # #
    0x70, //  ###
    0x48, //  #  #
    0x44, //  #   #
    0xE6, // ###  ##
    0x00, //
    0x00, //
    0x00, //

    // @528 'L' (7 pixels wide)
    0x00, //
    0x70, //  ###
    0x20, //   #
    0x20, //   #
    0x20, //   #
    0x20, //   #
    0x24, //   #  #
    0x24, //   #  #
    0x7C, //  #####
    0x00, //
    0x00, //
    0x00, //

    // @540 'M' (7 pixels wide)
    0x00, //
    0xEE, // ### ###
    0x6C, //  ## ##
    0x6C, //  ## ##
    0x54, //  # # #
    0x54, //  # # #
    0x44, //  #   #
    0x44, //  #   #
    0xEE, // ### ###
    0x00, //
    0x00, //
    0x00, //

    // @552 'N' (7 pixels wide)
    0x00, //
    0xEE, // ### ###
    0x64, //  ##  #
    0x64, //  ##  #
    0x54, //  # # #
    0x54, //  # # #
    0x54, //  # # #
    0x4C, //  #  ##
    0xEC, // ### ##
    0x00, //
    0x00, //
    0x00, //

    // @564 'O' (7 pixels wide)
    0x00, //
    0x38, //   ###
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x38, //   ###
    0x00, //
    0x00, //
    0x00, //

    // @576 'P' (7 pixels wide)
    0x00, //
    0x78, //  ####
    0x24, //   #  #
    0x24, //   #  #
    0x24, //   #  #
    0x38, //   ###
    0x20, //   #
    0x20, //   #
    0x70, //  ###
    0x00, //
    0x00, //
    0x00, //

    // @588 'Q' (7 pixels wide)
    0x00, //
    0x38, //   ###
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x38, //   ###
    0x1C, //    ###
    0x00, //
    0x00, //

    // @600 'R' (7 pixels wide)
    0x00, //
    0xF8, // #####
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x78, //  ####
    0x48, //  #  #
    0x44, //  #   #
    0xE2, // ###   #
    0x00, //
    0x00, //
    0x00, //

    // @612 'S' (7 pixels wide)
    0x00, //
    0x34, //   ## #
    0x4C, //  #  ##
    0x40, //  #
    0x38, //   ###
    0x04, //      #
    0x04, //      #
    0x64, //  ##  #
    0x58, //  # ##
    0x00, //
    0x00, //
    0x00, //

    // @624 'T' (7 pixels wide)
    0x00, //
    0xFE, // #######
    0x92, // #  #  #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x38, //   ###
    0x00, //
    0x00, //
    0x00, //

    // @636 'U' (7 pixels wide)
    0x00, //
    0xEE, // ### ###
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x38, //   ###
    0x00, //
    0x00, //
    0x00, //

    // @648 'V' (7 pixels wide)
    0x00, //
    0xEE, // ### ###
    0x44, //  #   #
    0x44, //  #   #
    0x28, //   # #
    0x28, //   # #
    0x28, //   # #
    0x10, //    #
    0x10, //    #
    0x00, //
    0x00, //
    0x00, //

    // @660 'W' (7 pixels wide)
    0x00, //
    0xEE, // ### ###
    0x44, //  #   #
    0x44, //  #   #
    0x54, //  # # #
    0x54, //  # # #
    0x54, //  # # #
    0x54, //  # # #
    0x28, //   # #
    0x00, //
    0x00, //
    0x00, //

    // @672 'X' (7 pixels wide)
    0x00, //
    0xC6, // ##   ##
    0x44, //  #   #
    0x28, //   # #
    0x10, //    #
    0x10, //    #
    0x28, //   # #
    0x44, //  #   #
    0xC6, // ##   ##
    0x00, //
    0x00, //
    0x00, //

    // @684 'Y' (7 pixels wide)
    0x00, //
    0xEE, // ### ###
    0x44, //  #   #
    0x28, //   # #
    0x28, //   # #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x38, //   ###
    0x00, //
    0x00, //
    0x00, //

    // @696 'Z' (7 pixels wide)
    0x00, //
    0x7C, //  #####
    0x44, //  #   #
    0x08, //     #
    0x10, //    #
    0x10, //    #
    0x20, //   #
    0x44, //  #   #
    0x7C, //  #####
    0x00, //
    0x00, //
    0x00, //

    // @708 '[' (7 pixels wide)
    0x00, //
    0x38, //   ###
    0x20, //   #
    0x20, //   #
    0x20, //   #
    0x20, //   #
    0x20, //   #
    0x20, //   #
    0x20, //   #
    0x20, //   #
    0x38, //   ###
    0x00, //

    // @720 '\' (7 pixels wide)
    0x00, //
    0x40, //  #
    0x20, //   #
    0x20, //   #
    0x20, //   #
    0x10, //    #
    0x10, //    #
    0x08, //     #
    0x08, //     #
    0x08, //     #
    0x00, //
    0x00, //

    // @732 ']' (7 pixels wide)
    0x00, //
    0x38, //   ###
    0x08, //     #
    0x08, //     #
    0x08, //     #
    0x08, //     #
    0x08, //     #
    0x08, //     #
    0x08, //     #
    0x08, //     #
    0x38, //   ###
    0x00, //

    // @744 '^' (7 pixels wide)
    0x00, //
    0x10, //    #
    0x10, //    #
    0x28, //   # #
    0x44, //  #   #
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //

    // @756 '_' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0xFE, // #######

    // @768 '`' (7 pixels wide)
    0x00, //
    0x10, //    #
    0x08, //     #
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //

    // @780 'a' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x38, //   ###
    0x44, //  #   #
    0x3C, //   ####
    0x44, //  #   #
    0x44, //  #   #
    0x3E, //   #####
    0x00, //
    0x00, //
    0x00, //

    // @792 'b' (7 pixels wide)
    0x00, //
    0xC0, // ##
    0x40, //  #
    0x58, //  # ##
    0x64, //  ##  #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0xF8, // #####
    0x00, //
    0x00, //
    0x00, //

    // @804 'c' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x3C, //   ####
    0x44, //  #   #
    0x40, //  #
    0x40, //  #
    0x44, //  #   #
    0x38, //   ###
    0x00, //
    0x00, //
    0x00, //

    // @816 'd' (7 pixels wide)
    0x00, //
    0x0C, //     ##
    0x04, //      #
    0x34, //   ## #
    0x4C, //  #  ##
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x3E, //   #####
    0x00, //
    0x00, //
    0x00, //

    // @828 'e' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x38, //   ###
    0x44, //  #   #
    0x7C, //  #####
    0x40, //  #
    0x40, //  #
    0x3C, //   ####
    0x00, //
    0x00, //
    0x00, //

    // @840 'f' (7 pixels wide)
    0x00, //
    0x1C, //    ###
    0x20, //   #
    0x7C, //  #####
    0x20, //   #
    0x20, //   #
    0x20, //   #
    0x20, //   #
    0x7C, //  #####
    0x00, //
    0x00, //
    0x00, //

    // @852 'g' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x36, //   ## ##
    0x4C, //  #  ##
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x3C, //   ####
    0x04, //      #
    0x38, //   ###
    0x00, //

    // @864 'h' (7 pixels wide)
    0x00, //
    0xC0, // ##
    0x40, //  #
    0x58, //  # ##
    0x64, //  ##  #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0xEE, // ### ###
    0x00, //
    0x00, //
    0x00, //

    // @876 'i' (7 pixels wide)
    0x00, //
    0x10, //    #
    0x00, //
    0x70, //  ###
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x7C, //  #####
    0x00, //
    0x00, //
    0x00, //

    // @888 'j' (7 pixels wide)
    0x00, //
    0x10, //    #
    0x00, //
    0x78, //  ####
    0x08, //     #
    0x08, //     #
    0x08, //     #
    0x08, //     #
    0x08, //     #
    0x08, //     #
    0x70, //  ###
    0x00, //

    // @900 'k' (7 pixels wide)
    0x00, //
    0xC0, // ##
    0x40, //  #
    0x5C, //  # ###
    0x48, //  #  #
    0x70, //  ###
    0x50, //  # #
    0x48, //  #  #
    0xDC, // ## ###
    0x00, //
    0x00, //
    0x00, //

    // @912 'l' (7 pixels wide)
    0x00, //
    0x30, //   ##
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x7C, //  #####
    0x00, //
    0x00, //
    0x00, //

    // @924 'm' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0xE8, // ### #
    0x54, //  # # #
    0x54, //  # # #
    0x54, //  # # #
    0x54, //  # # #
    0xFE, // #######
    0x00, //
    0x00, //
    0x00, //

    // @936 'n' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0xD8, // ## ##
    0x64, //  ##  #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0xEE, // ### ###
    0x00, //
    0x00, //
    0x00, //

    // @948 'o' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x38, //   ###
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x38, //   ###
    0x00, //
    0x00, //
    0x00, //

    // @960 'p' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0xD8, // ## ##
    0x64, //  ##  #
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x78, //  ####
    0x40, //  #
    0xE0, // ###
    0x00, //

    // @972 'q' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x36, //   ## ##
    0x4C, //  #  ##
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x3C, //   ####
    0x04, //      #
    0x0E, //     ###
    0x00, //

    // @984 'r' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x6C, //  ## ##
    0x30, //   ##
    0x20, //   #
    0x20, //   #
    0x20, //   #
    0x7C, //  #####
    0x00, //
    0x00, //
    0x00, //

    // @996 's' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x3C, //   ####
    0x44, //  #   #
    0x38, //   ###
    0x04, //      #
    0x44, //  #   #
    0x78, //  ####
    0x00, //
    0x00, //
    0x00, //

    // @1008 't' (7 pixels wide)
    0x00, //
    0x00, //
    0x20, //   #
    0x7C, //  #####
    0x20, //   #
    0x20, //   #
    0x20, //   #
    0x22, //   #   #
    0x1C, //    ###
    0x00, //
    0x00, //
    0x00, //

    // @1020 'u' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0xCC, // ##  ##
    0x44, //  #   #
    0x44, //  #   #
    0x44, //  #   #
    0x4C, //  #  ##
    0x36, //   ## ##
    0x00, //
    0x00, //
    0x00, //

    // @1032 'v' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0xEE, // ### ###
    0x44, //  #   #
    0x44, //  #   #
    0x28, //   # #
    0x28, //   # #
    0x10, //    #
    0x00, //
    0x00, //
    0x00, //

    // @1044 'w' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0xEE, // ### ###
    0x44, //  #   #
    0x54, //  # # #
    0x54, //  # # #
    0x54, //  # # #
    0x28, //   # #
    0x00, //
    0x00, //
    0x00, //

    // @1056 'x' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0xCC, // ##  ##
    0x48, //  #  #
    0x30, //   ##
    0x30, //   ##
    0x48, //  #  #
    0xCC, // ##  ##
    0x00, //
    0x00, //
    0x00, //

    // @1068 'y' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0xEE, // ### ###
    0x44, //  #   #
    0x24, //   #  #
    0x28, //   # #
    0x18, //    ##
    0x10, //    #
    0x10, //    #
    0x78, //  ####
    0x00, //

    // @1080 'z' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x7C, //  #####
    0x48, //  #  #
    0x10, //    #
    0x20, //   #
    0x44, //  #   #
    0x7C, //  #####
    0x00, //
    0x00, //
    0x00, //

    // @1092 '{' (7 pixels wide)
    0x00, //
    0x08, //     #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x20, //   #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x08, //     #
    0x00, //

    // @1104 '|' (7 pixels wide)
    0x00, //
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x00, //
    0x00, //

    // @1116 '}' (7 pixels wide)
    0x00, //
    0x20, //   #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x08, //     #
    0x10, //    #
    0x10, //    #
    0x10, //    #
    0x20, //   #
    0x00, //

    // @1128 '~' (7 pixels wide)
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x24, //   #  #
    0x58, //  # ##
    0x00, //
    0x00, //
    0x00, //
    0x00, //
    0x00, //
];


/**
 * Blocks for the Waveshare 1.8-inch 160x128 LCD and compatible boards.
 * Drawing operations update the onboard SRAM; call show to refresh the LCD.
 */
//% block="1.8in LCD"
//% weight=20 color=#436EEE icon="\uf108"
//% groups='["Setup", "Screen", "Draw", "Text", "Colors", "Advanced"]'
namespace LCD1IN8 {
    /** Initialize the LCD, SPI bus, backlight and onboard SRAM. */
    //% blockId=LCD_Init
    //% blockGap=8
    //% block="initialize 1.8in LCD"
    //% group="Setup"
    //% weight=200
    export function LCD_Init(): void {
        pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13)
        pins.spiFormat(8, 0)
        pins.spiFrequency(18000000)
        pins.digitalWritePin(DigitalPin.P16, 1)
        pins.digitalWritePin(DigitalPin.P2, 1)
        pins.digitalWritePin(DigitalPin.P12, 1)
        LCD_SetBL(10)

        pins.digitalWritePin(DigitalPin.P8, 1);
        basic.pause(100);
        pins.digitalWritePin(DigitalPin.P8, 0);
        basic.pause(100);
        pins.digitalWritePin(DigitalPin.P8, 1);
        basic.pause(100);

        //ST7735R Frame Rate
        LCD_WriteReg(0xB1);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        LCD_WriteReg(0xB2);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        LCD_WriteReg(0xB3);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        LCD_WriteReg(0xB4); //Column inversion
        LCD_WriteData_8Bit(0x07);

        //ST7735R Power Sequence
        LCD_WriteReg(0xC0);
        LCD_WriteData_8Bit(0xA2);
        LCD_WriteData_8Bit(0x02);
        LCD_WriteData_8Bit(0x84);
        LCD_WriteReg(0xC1);
        LCD_WriteData_8Bit(0xC5);

        LCD_WriteReg(0xC2);
        LCD_WriteData_8Bit(0x0A);
        LCD_WriteData_8Bit(0x00);

        LCD_WriteReg(0xC3);
        LCD_WriteData_8Bit(0x8A);
        LCD_WriteData_8Bit(0x2A);
        LCD_WriteReg(0xC4);
        LCD_WriteData_8Bit(0x8A);
        LCD_WriteData_8Bit(0xEE);

        LCD_WriteReg(0xC5); //VCOM
        LCD_WriteData_8Bit(0x0E);

        //ST7735R Gamma Sequence
        LCD_WriteReg(0xe0);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x1a);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x18);
        LCD_WriteData_8Bit(0x2f);
        LCD_WriteData_8Bit(0x28);
        LCD_WriteData_8Bit(0x20);
        LCD_WriteData_8Bit(0x22);
        LCD_WriteData_8Bit(0x1f);
        LCD_WriteData_8Bit(0x1b);
        LCD_WriteData_8Bit(0x23);
        LCD_WriteData_8Bit(0x37);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(0x07);
        LCD_WriteData_8Bit(0x02);
        LCD_WriteData_8Bit(0x10);

        LCD_WriteReg(0xe1);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x1b);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x17);
        LCD_WriteData_8Bit(0x33);
        LCD_WriteData_8Bit(0x2c);
        LCD_WriteData_8Bit(0x29);
        LCD_WriteData_8Bit(0x2e);
        LCD_WriteData_8Bit(0x30);
        LCD_WriteData_8Bit(0x30);
        LCD_WriteData_8Bit(0x39);
        LCD_WriteData_8Bit(0x3f);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(0x07);
        LCD_WriteData_8Bit(0x03);
        LCD_WriteData_8Bit(0x10);

        LCD_WriteReg(0xF0); //Enable test command
        LCD_WriteData_8Bit(0x01);

        LCD_WriteReg(0xF6); //Disable ram power save mode
        LCD_WriteData_8Bit(0x00);

        LCD_WriteReg(0x3A); //65k mode
        LCD_WriteData_8Bit(0x05);

        LCD_WriteReg(0x36); //MX, MY, RGB mode
        LCD_WriteData_8Bit(0xF7 & 0xA0); //RGB color filter panel

        //sleep out
        LCD_WriteReg(0x11);
        basic.pause(120);

        LCD_WriteReg(0x29);
        basic.pause(20);
        SPIRAM_Set_Mode(SRAM_BYTE_MODE);
    }

    /** Clear the visible LCD to white without changing the drawing cache. */
    //% blockId=LCD_Clear
    //% blockGap=8
    //% block="clear LCD to white"
    //% group="Screen"
    //% weight=195
    export function LCD_Clear(): void {
        LCD_SetWindows(0, 0, LCD_WIDTH, LCD_HEIGHT);
        LCD_SetColor(LCD_COLOR.WHITE, LCD_WIDTH * LCD_HEIGHT);
    }

    /** Fill the visible LCD with a color without changing the drawing cache. */
    //% blockId=LCD_Filling
    //% blockGap=8
    //% block="fill LCD color %Color=LCD1IN8_color"
    //% group="Screen"
    //% weight=194
    export function LCD_Filling(Color: number): void {
        LCD_SetWindows(0, 0, LCD_WIDTH, LCD_HEIGHT);
        LCD_SetColor(Color, LCD_WIDTH * LCD_HEIGHT);
    }

    /** Set backlight brightness from 0 (off) to 10 (full). */
    //% blockId=LCD_SetBL
    //% blockGap=8
    //% block="set backlight level %Lev"
    //% Lev.min=0 Lev.max=10 Lev.defl=10
    //% group="Setup"
    //% weight=180
    export function LCD_SetBL(Lev: number): void {
        Lev = Math.max(0, Math.min(10, Lev))
        pins.analogWritePin(AnalogPin.P1, Math.idiv(Lev * 1023, 10))
    }

    /** Return a standard RGB565 color for use in drawing blocks. */
    //% blockId=LCD1IN8_color
    //% block="%Color"
    //% group="Colors"
    //% weight=80
    export function Get_Color(Color: LCD_COLOR): number {
        return Color
    }

    /** Create an RGB565 color from 8-bit red, green and blue values. */
    //% blockId=LCD1IN8_rgb565
    //% block="RGB565 red %red green %green blue %blue"
    //% red.min=0 red.max=255 red.defl=255
    //% green.min=0 green.max=255 green.defl=255
    //% blue.min=0 blue.max=255 blue.defl=255
    //% group="Colors"
    //% weight=70
    export function rgb565(red: number, green: number, blue: number): number {
        red = Math.max(0, Math.min(255, red))
        green = Math.max(0, Math.min(255, green))
        blue = Math.max(0, Math.min(255, blue))
        return ((red & 0xF8) << 8) | ((green & 0xFC) << 3) | (blue >> 3)
    }

    function LCD_WriteReg(reg: number): void {
        pins.digitalWritePin(DigitalPin.P12, 0);
        pins.digitalWritePin(DigitalPin.P16, 0);
        pins.spiWrite(reg & 0xff);
        pins.digitalWritePin(DigitalPin.P16, 1);
    }

    function LCD_WriteData_8Bit(Data: number): void {
        pins.digitalWritePin(DigitalPin.P12, 1);
        pins.digitalWritePin(DigitalPin.P16, 0);
        pins.spiWrite(Data & 0xff);
        pins.digitalWritePin(DigitalPin.P16, 1);
    }

    function LCD_WriteData_Buf(Buf: number, len: number): void {
        const chunk = pins.createBuffer(128)
        const high = (Buf >> 8) & 0xff
        const low = Buf & 0xff
        for (let offset = 0; offset < chunk.length; offset += 2) {
            chunk[offset] = high
            chunk[offset + 1] = low
        }
        pins.digitalWritePin(DigitalPin.P12, 1);
        pins.digitalWritePin(DigitalPin.P16, 0);
        while (len >= 64) {
            pins.spiTransfer(chunk, null)
            len -= 64
        }
        for (let i = 0; i < len; i++) {
            pins.spiWrite(high)
            pins.spiWrite(low)
        }
        pins.digitalWritePin(DigitalPin.P16, 1);
    }

    function LCD_SetWindows(Xstart: number, Ystart: number, Xend: number, Yend: number): void {
        Xstart = Math.max(0, Math.min(LCD_WIDTH - 1, Xstart))
        Ystart = Math.max(0, Math.min(LCD_HEIGHT - 1, Ystart))
        Xend = Math.max(Xstart + 1, Math.min(LCD_WIDTH, Xend))
        Yend = Math.max(Ystart + 1, Math.min(LCD_HEIGHT, Yend))
        //set the X coordinates
        LCD_WriteReg(0x2A);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit((Xstart & 0xff) + 1);
        LCD_WriteData_8Bit(0x00 );
        LCD_WriteData_8Bit(((Xend - 1) & 0xff) + 1);

        //set the Y coordinates
        LCD_WriteReg(0x2B);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit((Ystart & 0xff) + 2);
        LCD_WriteData_8Bit(0x00 );
        LCD_WriteData_8Bit(((Yend - 1) & 0xff)+ 2);

        LCD_WriteReg(0x2C);
    }

    function LCD_SetColor(Color: number, pixels: number): void {
        LCD_WriteData_Buf(Color, pixels);
    }

    function LCD_SetPoint(Xpoint: number, Ypoint: number, Color: number): void {
        if (Xpoint < 0 || Xpoint >= LCD_WIDTH || Ypoint < 0 || Ypoint >= LCD_HEIGHT) return
        let Addr = (Xpoint + Ypoint * LCD_WIDTH) * 2;
        SPIRAM_WR_Byte(Addr, Color >> 8);
        SPIRAM_WR_Byte(Addr + 1, Color & 0xff);
    }

    /** Clear the onboard drawing cache to white. */
    //% blockId=Draw_Clear
    //% blockGap=8
    //% block="clear drawing cache"
    //% group="Screen"
    //% weight=193
    export function LCD_ClearBuf(): void {
        const chunk = pins.createBuffer(128)
        chunk.fill(0xff)
        SPIRAM_Set_Mode(SRAM_STREAM_MODE);
        pins.digitalWritePin(DigitalPin.P2, 0);
        pins.spiWrite(SRAM_CMD_WRITE);
        pins.spiWrite(0);
        pins.spiWrite(0);
        pins.spiWrite(0);
        for (let i = 0; i < LCD_WIDTH * LCD_HEIGHT * 2 / chunk.length; i++) {
            pins.spiTransfer(chunk, null)
        }
        pins.digitalWritePin(DigitalPin.P2, 1);
    }

    /** Copy the complete drawing cache to the LCD. */
    //% blockId=LCD_Display
    //% blockGap=8
    //% block="show drawing cache on LCD"
    //% group="Screen"
    //% weight=190
    export function LCD_Display(): void {
        SPIRAM_Set_Mode(SRAM_STREAM_MODE);
        LCD_SetWindows(0, 0, LCD_WIDTH, LCD_HEIGHT);
        const rbuf = pins.createBuffer(LCD_WIDTH * 2 * 2)
        for (let row = 0; row < LCD_HEIGHT; row += 2) {
            SPIRAM_Read((row * LCD_WIDTH) * 2, rbuf)
            LCD_WriteBuffer(rbuf)
        }
        LCD_WriteReg(0x29);
    }

    /** Copy an inclusive rectangular area of the drawing cache to the LCD. */
    //% blockId=LCD_DisplayWindows
    //% blockGap=8
    //% block="show cache area x1 %Xstart y1 %Ystart x2 %Xend y2 %Yend"
    //% Xstart.min=1 Xstart.max=160 Xstart.defl=1
    //% Ystart.min=1 Ystart.max=128 Ystart.defl=1
    //% Xend.min=1 Xend.max=160 Xend.defl=80
    //% Yend.min=1 Yend.max=128 Yend.defl=64
    //% group="Advanced"
    //% weight=60
    export function LCD_DisplayWindows(Xstart: number, Ystart: number, Xend: number, Yend: number): void {
        Xstart = Math.max(1, Math.min(LCD_WIDTH, Xstart))
        Xend = Math.max(1, Math.min(LCD_WIDTH, Xend))
        Ystart = Math.max(1, Math.min(LCD_HEIGHT, Ystart))
        Yend = Math.max(1, Math.min(LCD_HEIGHT, Yend))
        if (Xstart > Xend) {
            const temp = Xstart
            Xstart = Xend
            Xend = temp
        }
        if (Ystart > Yend) {
            const temp = Ystart
            Ystart = Yend
            Yend = temp
        }

        const x0 = Xstart - 1
        const y0 = Ystart - 1
        const width = Xend - Xstart + 1
        const height = Yend - Ystart + 1
        const rowBuffer = pins.createBuffer(width * 2)
        SPIRAM_Set_Mode(SRAM_STREAM_MODE)
        LCD_SetWindows(x0, y0, x0 + width, y0 + height)
        for (let row = 0; row < height; row++) {
            SPIRAM_Read(((y0 + row) * LCD_WIDTH + x0) * 2, rowBuffer)
            LCD_WriteBuffer(rowBuffer)
        }
        LCD_WriteReg(0x29)
    }

    function LCD_WriteBuffer(data: Buffer): void {
        pins.digitalWritePin(DigitalPin.P12, 1)
        pins.digitalWritePin(DigitalPin.P16, 0)
        pins.spiTransfer(data, null)
        pins.digitalWritePin(DigitalPin.P16, 1)
    }

    function SPIRAM_Read(address: number, data: Buffer): void {
        pins.digitalWritePin(DigitalPin.P2, 0)
        pins.spiWrite(SRAM_CMD_READ)
        pins.spiWrite((address >> 16) & 0xff)
        pins.spiWrite((address >> 8) & 0xff)
        pins.spiWrite(address & 0xff)
        pins.spiTransfer(null, data)
        pins.digitalWritePin(DigitalPin.P2, 1)
    }

    /** Draw a pixel into the onboard cache using 1-based LCD coordinates. */
    //% blockId=DrawPoint
    //% blockGap=8
    //% block="draw pixel x %Xpoint y %Ypoint color %Color=LCD1IN8_color size %Dot_Pixel"
    //% Xpoint.min=1 Xpoint.max=160 Xpoint.defl=80
    //% Ypoint.min=1 Ypoint.max=128 Ypoint.defl=64
    //% Color.min=0 Color.max=65535
    //% group="Draw"
    //% weight=150
    export function DrawPoint(Xpoint: number, Ypoint: number, Color: number, Dot_Pixel: DOT_PIXEL): void {
        for (let dx = 0; dx < Dot_Pixel; dx++) {
            for (let dy = 0; dy < Dot_Pixel; dy++) {
                LCD_SetPoint(Xpoint - 1 - dx, Ypoint - 1 - dy, Color);
            }
        }
    }

    /** Draw a solid or dotted line into the onboard cache. */
    //% blockId=DrawLine
    //% blockGap=8
    //% block="draw line x1 %Xstart y1 %Ystart x2 %Xend y2 %Yend color %Color=LCD1IN8_color width %Line_width style %Line_Style"
    //% Xstart.min=1 Xstart.max=160 Xstart.defl=1
    //% Ystart.min=1 Ystart.max=128 Ystart.defl=1
    //% Xend.min=1 Xend.max=160 Xend.defl=160
    //% Yend.min=1 Yend.max=128 Yend.defl=128
    //% Color.min=0 Color.max=65535
    //% group="Draw"
    //% weight=140
    export function DrawLine(Xstart: number, Ystart: number, Xend: number, Yend: number, Color: number, Line_width: DOT_PIXEL, Line_Style: LINE_STYLE): void {
        let Xpoint = Xstart;
        let Ypoint = Ystart;
        let dx = Xend - Xstart >= 0 ? Xend - Xstart : Xstart - Xend;
        let dy = Yend - Ystart <= 0 ? Yend - Ystart : Ystart - Yend;

        // Increment direction, 1 is positive, -1 is counter;
        let XAddway = Xstart < Xend ? 1 : -1;
        let YAddway = Ystart < Yend ? 1 : -1;

        //Cumulative error
        let Esp = dx + dy;
        let Line_Style_Temp = 0;

        for (; ;) {
            Line_Style_Temp++;
            //Painted dotted line, 2 point is really virtual
            if (Line_Style == LINE_STYLE.LINE_DOTTED && Line_Style_Temp % 3 == 0) {
                DrawPoint(Xpoint, Ypoint, GUI_BACKGROUND_COLOR, Line_width);
            } else {
                DrawPoint(Xpoint, Ypoint, Color, Line_width);
            }
            if (2 * Esp >= dy) {
                if (Xpoint == Xend) break;
                Esp += dy
                Xpoint += XAddway;
            }
            if (2 * Esp <= dx) {
                if (Ypoint == Yend) break;
                Esp += dx;
                Ypoint += YAddway;
            }
        }
    }

    /** Draw an outline or filled rectangle into the onboard cache. */
    //% blockId=DrawRectangle
    //% blockGap=8
    //% block="draw rectangle x1 %Xstart2 y1 %Ystart2 x2 %Xend2 y2 %Yend2 color %Color=LCD1IN8_color fill %Filled width %Dot_Pixel"
    //% Xstart2.min=1 Xstart2.max=160 Xstart2.defl=20
    //% Ystart2.min=1 Ystart2.max=128 Ystart2.defl=20
    //% Xend2.min=1 Xend2.max=160 Xend2.defl=140
    //% Yend2.min=1 Yend2.max=128 Yend2.defl=108
    //% Color.min=0 Color.max=65535
    //% group="Draw"
    //% weight=130
    export function DrawRectangle(Xstart2: number, Ystart2: number, Xend2: number, Yend2: number, Color: number, Filled: DRAW_FILL, Dot_Pixel: DOT_PIXEL): void {
        if (Xstart2 > Xend2) {
            const temp = Xstart2
            Xstart2 = Xend2
            Xend2 = temp
        }
        if (Ystart2 > Yend2) {
            const temp = Ystart2
            Ystart2 = Yend2
            Yend2 = temp
        }

        let Ypoint = 0;
        if (Filled) {
            for (Ypoint = Ystart2; Ypoint <= Yend2; Ypoint++) {
                DrawLine(Xstart2, Ypoint, Xend2, Ypoint, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            }
        } else {
            DrawLine(Xstart2, Ystart2, Xend2, Ystart2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xstart2, Ystart2, Xstart2, Yend2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xend2, Yend2, Xend2, Ystart2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xend2, Yend2, Xstart2, Yend2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
        }
    }

    /** Draw an outline or filled circle into the onboard cache. */
    //% blockId=DrawCircle
    //% blockGap=8
    //% block="draw circle x %X_Center y %Y_Center radius %Radius color %Color=LCD1IN8_color fill %Draw_Fill width %Dot_Pixel"
    //% X_Center.min=1 X_Center.max=160 X_Center.defl=80
    //% Y_Center.min=1 Y_Center.max=128 Y_Center.defl=64
    //% Radius.min=0 Radius.max=80 Radius.defl=20
    //% Color.min=0 Color.max=65535
    //% group="Draw"
    //% weight=120
    export function DrawCircle(X_Center: number, Y_Center: number, Radius: number, Color: number, Draw_Fill: DRAW_FILL, Dot_Pixel: DOT_PIXEL): void {
        Radius = Math.max(0, Math.min(160, Radius))
        //Draw a circle from(0, R) as a starting point
        let XCurrent = 0;
        let YCurrent = Radius;

        //Cumulative error,judge the next point of the logo
        let Esp = 3 - (Radius << 1);

        let sCountY = 0;
        if (Draw_Fill == DRAW_FILL.DRAW_FULL) {//DrawPoint(Xpoint, Ypoint, GUI_BACKGROUND_COLOR, Line_width);
            while (XCurrent <= YCurrent) { //Realistic circles
                for (sCountY = XCurrent; sCountY <= YCurrent; sCountY++) {
                    DrawPoint(X_Center + XCurrent, Y_Center + sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //1
                    DrawPoint(X_Center - XCurrent, Y_Center + sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //2
                    DrawPoint(X_Center - sCountY, Y_Center + XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);             //3
                    DrawPoint(X_Center - sCountY, Y_Center - XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);             //4
                    DrawPoint(X_Center - XCurrent, Y_Center - sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //5
                    DrawPoint(X_Center + XCurrent, Y_Center - sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //6
                    DrawPoint(X_Center + sCountY, Y_Center - XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);             //7
                    DrawPoint(X_Center + sCountY, Y_Center + XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);
                }
                if (Esp < 0)
                    Esp += 4 * XCurrent + 6;
                else {
                    Esp += 10 + 4 * (XCurrent - YCurrent);
                    YCurrent--;
                }
                XCurrent++;
            }
        } else { //Draw a hollow circle
            while (XCurrent <= YCurrent) {
                DrawPoint(X_Center + XCurrent, Y_Center + YCurrent, Color, Dot_Pixel);             //1
                DrawPoint(X_Center - XCurrent, Y_Center + YCurrent, Color, Dot_Pixel);             //2
                DrawPoint(X_Center - YCurrent, Y_Center + XCurrent, Color, Dot_Pixel);             //3
                DrawPoint(X_Center - YCurrent, Y_Center - XCurrent, Color, Dot_Pixel);             //4
                DrawPoint(X_Center - XCurrent, Y_Center - YCurrent, Color, Dot_Pixel);             //5
                DrawPoint(X_Center + XCurrent, Y_Center - YCurrent, Color, Dot_Pixel);             //6
                DrawPoint(X_Center + YCurrent, Y_Center - XCurrent, Color, Dot_Pixel);             //7
                DrawPoint(X_Center + YCurrent, Y_Center + XCurrent, Color, Dot_Pixel);             //0

                if (Esp < 0)
                    Esp += 4 * XCurrent + 6;
                else {
                    Esp += 10 + 4 * (XCurrent - YCurrent);
                    YCurrent--;
                }
                XCurrent++;
            }
        }
    }

    /** Draw printable ASCII text into the onboard cache. */
    //% blockId=DisString
    //% blockGap=8
    //% block="draw text x %Xchar y %Ychar text %ch color %Color=LCD1IN8_color"
    //% Xchar.min=1 Xchar.max=160 Xchar.defl=1
    //% Ychar.min=1 Ychar.max=128 Ychar.defl=1
    //% ch.defl="Hello!"
    //% Color.min=0 Color.max=65535
    //% group="Text"
    //% weight=100
    export function DisString(Xchar: number, Ychar: number, ch: string, Color: number): void {
        const fontHeight = 12
        const fontWidth = 7
        const originX = Math.max(0, Math.min(LCD_WIDTH - 1, Xchar - 1))
        let Xpoint = originX
        let Ypoint = Math.max(0, Math.min(LCD_HEIGHT - 1, Ychar - 1))
        for (let i = 0; i < ch.length; i++) {
            if (Xpoint + fontWidth > LCD_WIDTH) {
                Xpoint = originX
                Ypoint += fontHeight
            }
            if (Ypoint + fontHeight > LCD_HEIGHT) break

            let charCode = ch.charCodeAt(i)
            if (charCode < 32 || charCode > 126) charCode = 63
            DisChar_1207(Xpoint, Ypoint, (charCode - 32) * fontHeight, Color)
            Xpoint += fontWidth
        }
    }

    /** Draw a number into the onboard cache. */
    //% blockId=DisNumber
    //% blockGap=8
    //% block="draw number x %Xnum y %Ynum number %num color %Color=LCD1IN8_color"
    //% Xnum.min=1 Xnum.max=160 Xnum.defl=1
    //% Ynum.min=1 Ynum.max=128 Ynum.defl=1
    //% num.defl=123
    //% Color.min=0 Color.max=65535
    //% group="Text"
    //% weight=90
    export function DisNumber(Xnum: number, Ynum: number, num: number, Color: number): void {
        DisString(Xnum, Ynum, num + "", Color);
    }

    function DisChar_1207(Xchar:number, Ychar:number, Char_Offset:number, Color:number): void {
        let Page = 0, Column = 0;
        let off = Char_Offset
        for(Page = 0; Page < 12; Page ++ ) {
            for(Column = 0; Column < 7; Column ++ ) {
                if(Font12_Table[off] & (0x80 >> (Column % 8)))
                    LCD_SetPoint(Xchar + Column, Ychar + Page, Color);

                //One pixel is 8 bits
                if(Column % 8 == 7)
                    off++;
            }// Write a line
            if(7 % 8 != 0)
                off++;
        }// Write all
    }

    //spi ram
    function SPIRAM_Set_Mode(mode:number): void {
        pins.digitalWritePin(DigitalPin.P2, 0);
        pins.spiWrite(SRAM_CMD_WRSR);
        pins.spiWrite(mode);
        pins.digitalWritePin(DigitalPin.P2, 1);
    }

    function SPIRAM_WR_Byte(Addr: number, Data: number): void {
        pins.digitalWritePin(DigitalPin.P2, 0);
        pins.spiWrite(SRAM_CMD_WRITE);
        pins.spiWrite((Addr >> 16) & 0xff);
        pins.spiWrite((Addr >> 8) & 0xff);
        pins.spiWrite(Addr & 0xff);
        pins.spiWrite(Data & 0xff);
        pins.digitalWritePin(DigitalPin.P2, 1);
    }
}
