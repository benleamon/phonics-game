#! /bin/bash 
# Sets the desired thumbnail width
WIDTH=270
# Loops through all png files in current folder
for i in *.png
do
    # Stores the width of the current file
    iwidth=`identify -format "%w" $i`
    iheight=`identify -format "%h" $i`
    # Checks current filename does not end with '-thumb' and
    # file is greater than desired width
    if [[ $i != *-thumb.png ]] && [ $iwidth -gt $WIDTH ]
    then
        # Stores filename without extension
        filename=`basename -s .png $i`
        # Creates thumbnail and adds -thumb to end of new file
        convert -thumbnail ${WIDTH}x $i "$filename-thumb.png"

		# This will add extra space to the top, make the whole thing a 300px square
        # convert "$filename-thumb.png" -gravity Center -background white -extent ${WIDTH}x${WIDTH} "$filename-thumb.png"

        optipng -o7 -strip all $filename-thumb.png

    fi
done
