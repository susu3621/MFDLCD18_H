"""MicroPython hardware smoke test for the MFDLCD18_H board.

The test first verifies the external 23LC1024 SRAM, then drives the LCD
directly with the GC9106 register sequence used by the original driver.
It leaves a white screen containing a border, a red rectangle, a green
circle, and two blue diagonal lines.
"""

from microbit import Image, display, pin1, pin2, pin8, pin12, pin13, pin14, pin15, pin16, sleep, spi


LCD_WIDTH = 160
LCD_HEIGHT = 128

LCD_CS = pin16
LCD_DC = pin12
LCD_RST = pin8
LCD_BL = pin1
SRAM_CS = pin2

WHITE = 0xFFFF
BLACK = 0x0000
RED = 0xF800
GREEN = 0x07E0
BLUE = 0x001F


def spi_byte(value):
    spi.write(bytes((value & 0xFF,)))


def lcd_command(command, data=None):
    LCD_DC.write_digital(0)
    LCD_CS.write_digital(0)
    spi_byte(command)
    LCD_CS.write_digital(1)
    if data is not None:
        LCD_DC.write_digital(1)
        LCD_CS.write_digital(0)
        spi.write(bytes(data))
        LCD_CS.write_digital(1)


def lcd_init():
    LCD_CS.write_digital(1)
    SRAM_CS.write_digital(1)
    LCD_DC.write_digital(1)
    LCD_BL.set_analog_period(20)
    LCD_BL.write_analog(1023)
    spi.init(baudrate=1000000, bits=8, mode=0, sclk=pin13, mosi=pin15, miso=pin14)

    LCD_RST.write_digital(1)
    sleep(100)
    LCD_RST.write_digital(0)
    sleep(100)
    LCD_RST.write_digital(1)
    sleep(100)

    # GC9106 initialization from the original C++ driver in this repository.
    lcd_command(0xFE)
    lcd_command(0xFE)
    lcd_command(0xEF)
    lcd_command(0xB3, (0x03,))
    lcd_command(0xB6, (0x01,))
    lcd_command(0xA3, (0x11,))
    lcd_command(0x21)
    lcd_command(0x36, (0x67,))
    lcd_command(0x3A, (0x05,))
    lcd_command(0xB4, (0x21,))
    lcd_command(0xF0, (0x31, 0x26, 0x28, 0x00, 0x2C, 0x0C, 0x0C, 0x15, 0x15, 0x0F))
    lcd_command(0xF1, (0x0E, 0x12, 0x13, 0x00, 0x0A, 0x0D, 0x0D, 0x14, 0x13, 0x0F))
    lcd_command(0xFE)
    lcd_command(0xFF)
    lcd_command(0x11)
    sleep(120)
    lcd_command(0x29)
    sleep(20)


def lcd_window(x0, y0, x1, y1):
    """Select a half-open display window [x0,x1) by [y0,y1)."""
    lcd_command(0x2A, (x0 >> 8, x0, (x1 - 1) >> 8, x1 - 1))
    lcd_command(0x2B, (y0 >> 8, y0, (y1 - 1) >> 8, y1 - 1))
    lcd_command(0x2C)


def lcd_fill(color):
    high = color >> 8
    low = color & 0xFF
    row = bytes((high, low)) * LCD_WIDTH
    lcd_window(0, 0, LCD_WIDTH, LCD_HEIGHT)
    LCD_DC.write_digital(1)
    LCD_CS.write_digital(0)
    for _ in range(LCD_HEIGHT):
        spi.write(row)
    LCD_CS.write_digital(1)


def lcd_pixel(x, y, color):
    if x < 0 or x >= LCD_WIDTH or y < 0 or y >= LCD_HEIGHT:
        return
    lcd_window(x, y, x + 1, y + 1)
    LCD_DC.write_digital(1)
    LCD_CS.write_digital(0)
    spi.write(bytes((color >> 8, color & 0xFF)))
    LCD_CS.write_digital(1)


def lcd_line(x0, y0, x1, y1, color):
    dx = abs(x1 - x0)
    sx = 1 if x0 < x1 else -1
    dy = -abs(y1 - y0)
    sy = 1 if y0 < y1 else -1
    error = dx + dy
    while True:
        lcd_pixel(x0, y0, color)
        if x0 == x1 and y0 == y1:
            return
        twice_error = 2 * error
        if twice_error >= dy:
            error += dy
            x0 += sx
        if twice_error <= dx:
            error += dx
            y0 += sy


def lcd_rectangle(x0, y0, x1, y1, color, filled=False):
    if filled:
        for y in range(y0, y1 + 1):
            lcd_line(x0, y, x1, y, color)
    else:
        lcd_line(x0, y0, x1, y0, color)
        lcd_line(x1, y0, x1, y1, color)
        lcd_line(x1, y1, x0, y1, color)
        lcd_line(x0, y1, x0, y0, color)


def lcd_circle(cx, cy, radius, color):
    x = radius
    y = 0
    error = 1 - radius
    while x >= y:
        lcd_pixel(cx + x, cy + y, color)
        lcd_pixel(cx + y, cy + x, color)
        lcd_pixel(cx - y, cy + x, color)
        lcd_pixel(cx - x, cy + y, color)
        lcd_pixel(cx - x, cy - y, color)
        lcd_pixel(cx - y, cy - x, color)
        lcd_pixel(cx + y, cy - x, color)
        lcd_pixel(cx + x, cy - y, color)
        y += 1
        if error < 0:
            error += 2 * y + 1
        else:
            x -= 1
            error += 2 * (y - x) + 1


def sram_mode(mode):
    SRAM_CS.write_digital(0)
    spi.write(bytes((0x01, mode)))
    SRAM_CS.write_digital(1)


def sram_write(address, data):
    SRAM_CS.write_digital(0)
    spi.write(bytes((0x02, (address >> 16) & 0xFF, (address >> 8) & 0xFF, address & 0xFF)))
    spi.write(data)
    SRAM_CS.write_digital(1)


def sram_read(address, length):
    SRAM_CS.write_digital(0)
    spi.write(bytes((0x03, (address >> 16) & 0xFF, (address >> 8) & 0xFF, address & 0xFF)))
    data = spi.read(length, 0)
    SRAM_CS.write_digital(1)
    return data


def test_sram():
    sram_mode(0x40)
    pattern = bytes((0x00, 0xFF, 0x55, 0xAA, 0x12, 0x34, 0xDE, 0xAD, 0xBE, 0xEF))
    for address in (0x00000, 0x01234, 0x10010):
        sram_write(address, pattern)
        actual = sram_read(address, len(pattern))
        print("SRAM", hex(address), "PASS" if actual == pattern else "FAIL", actual)
        if actual != pattern:
            return False
    return True


def main():
    display.show(Image.ARROW_N)
    lcd_init()
    sram_ok = test_sram()
    print("SRAM_RESULT", "PASS" if sram_ok else "FAIL")

    for name, color in (("RED", RED), ("GREEN", GREEN), ("BLUE", BLUE)):
        print("LCD_STAGE", name)
        lcd_fill(color)
        sleep(1200)

    print("LCD_STAGE", "GEOMETRY")
    lcd_fill(WHITE)
    lcd_rectangle(4, 4, 155, 123, BLACK)
    lcd_rectangle(18, 22, 67, 60, RED, True)
    lcd_circle(112, 48, 25, GREEN)
    lcd_line(14, 112, 145, 74, BLUE)
    lcd_line(14, 74, 145, 112, BLUE)
    print("TEST_COMPLETE")
    display.show(Image.YES if sram_ok else Image.NO)


main()
