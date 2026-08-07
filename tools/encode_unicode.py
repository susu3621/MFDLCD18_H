#!/usr/bin/env python3
"""Convert text to the hexadecimal code-point format used by DisUnicodeHex."""

import argparse


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("text", help="Text to encode")
    arguments = parser.parse_args()
    print(" ".join("%04X" % ord(character) for character in arguments.text))


if __name__ == "__main__":
    main()
